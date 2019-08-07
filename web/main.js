;(function() {
    var version = '1.0.0',
        keys = {},
        key = "",
        isSetting = false,
        $search = document.querySelector('#search'),
        $keyboard = document.querySelector('#keyboard'),
        $keys = document.querySelectorAll('#keyboard li'),
        $setting = document.querySelector('#setting'),
        $close = document.querySelector('.close'),
        $closeSettings = document.querySelector('.closeSettings'),
        $settings = document.querySelector('#settings'),
        $newWindow = document.querySelector('#newWindow'),
        $searchEngine = document.querySelector('#searchEngine'),
        $key = document.querySelector('#key'),
        $site = document.querySelector('#site'),
        $logo = document.querySelector('#logo'),
        $urlSet = document.querySelector('#urlSet')


    // init
    if (localStorage.version != version) {
        localStorage.version = version
        localStorage.newWindow = 0
        localStorage.searchEngine = 'https://www.google.com/search?q='
        localStorage[67] = 'https://www.coding.net'
        localStorage[72] = 'https://huguotao.com'
        localStorage[84] = 'https://www.taobao.com'
        localStorage[86] = 'https://www.v2ex.com'
        localStorage[87] = 'https://www.weibo.com'
    }

    for (var i in $keys) {
        if (!$keys.hasOwnProperty(i)) continue

        keys[$keys[i].dataset.key] = {
            'li': $keys[i],
            'span': $keys[i].firstElementChild
        }
    }

    // set favicon
    for (var i = 48; i < 91; i++) {
        var url = localStorage[i]
        if (url) addFavicon(keys[i]['li'], getFavicon(url))
    }

    // read settings
    if (~~localStorage.newWindow) {
        $newWindow.classList.add('active')
    } else {
        $newWindow.classList.remove('active')
    }
    $searchEngine.value = localStorage.searchEngine

    function getFavicon(url) {
      if (localStorage[url]) {
        return localStorage[url]
      } else {
        return url.split('/').slice(0,3).join('/') + "/favicon.ico"
      }
    }

    function addFavicon($li, src) {
        var img = document.createElement('img')
        img.src = src
        img.className = 'fav'
        $li.appendChild(img)
    }

    function keyDown(key) {
      console.log(key)
        if (!key) return
        keys[key]['span'].classList.add('keyDownSpan')
        keys[key]['li'].classList.add('keyDownLi')
    }

    function keyUp(key) {
        if (!key) return
        keys[key]['span'].classList.remove('keyDownSpan')
        keys[key]['li'].classList.remove('keyDownLi')
    }

    function openUrl(url) {
        if (~~localStorage.newWindow) {
            window.open(url)
        } else {
            location.href = url
        }
    }

    $search.onkeyup = function(e) {
        if (e.target.value == 'set') return $setting.style.bottom = 0
        var key = e.which || e.keyCode || 0;
        if (key == 13) openUrl(localStorage.searchEngine + e.target.value)
    }

    $close.onclick = function() {
        $setting.style.bottom = '-320px'
    }

    $closeSettings.onclick = function() {
        // 恢复跳转
        isSetting = false
        $settings.style.top = '-320px'
    }

    var keyCache = 0
    document.onkeydown = function(e) {
        var key = e.which || e.keyCode || 0
        keyCache = key
        if (key == 9) {
            window.event ? window.event.returnValue = false : e.preventDefault()
            if (document.activeElement == $search) {
                $search.blur()
            } else {
                $search.focus()
            }
        }
        keyDown(key)
    }

    document.onkeyup = function(e) {
        var key = e.which || e.keyCode || 0,
            url = localStorage[key]
        keyUp(key)

        if (url && key == keyCache && document.activeElement != $search && !isSetting) openUrl(url)
        keyCache = 0
    }

    $keyboard.onclick = function(e) {
        if (e.target.tagName != 'SPAN') return
        // 静止跳转
        isSetting = true
        var name = e.target.innerText;
        key = e.target.parentElement.dataset.key || 0
            $key.value = name
            $site.value = localStorage[key] || ''
            // url = prompt("请输入按键 " + name + " 对应的网址", localStorage[key] || '')
            if (localStorage[key]) {
              $logo.value = localStorage[key] + '/favicon.ico'
            } else {
              $logo.value = ""
            }
            $settings.style.top = '0px'
    }

    // 修改键盘对应网址
    $urlSet.onclick = function () {
      console.log("it's ok!")
      var url = $site.value
      if (url === null) return
      if (url && url.indexOf('http') != 0) url = 'http://' + url
      // 手动设值logo
      if ($logo.value.length > 0) {
        localStorage[url] = $logo.value
      }
      localStorage[key] = url
      location.reload()
    }

    $newWindow.onclick = function() {
        this.classList.toggle('active')
        localStorage.newWindow = +!!!~~localStorage.newWindow
    }

    $searchEngine.onchange = function(e) {
        localStorage.searchEngine = e.target.value
        // change logo
        switch (e.target.value.match(/(.*\/\/)?(www\.)?(\w*).*/)[3]) {
          case "google":
              $('#logo-default').css('background-image', 'url(' + window.googleLogo + ')')
              $('#logo-default').css('-webkit-mask-image', 'url(' + window.googleLogo + ')')
              $('#logo-default').css('background', '#eee')
            break;
          case "baidu":
            $('#logo-default').css('-webkit-mask-image', 'url(' + window.baiduLogo + ')')
            $('#logo-default').css('background-image', 'url(' + window.baiduLogo + ')')
            $('#logo-default').css('background', '#eee')
            break;
          case "bing":
            $('#logo-default').css('-webkit-mask-image', 'url(' + window.bingLogo + ')')
            $('#logo-default').css('background-image', 'url(' + window.bingLogo + ')')
            $('#logo-default').css('background', '#eee')
            break;
          default:
        }
    }
    // 获取重定向url手动加背景
    new Promise(function(resolve, reject) {
      fetch('https://source.unsplash.com/random/1920*1080')
      .then(reason => {
        resolve(reason.url)
      });
    }).then(e => {
      $(".body").css('background-image', 'url(' + e + ')')
      $("#downloadImage").attr("href", e.split("?")[0])
    })
})()
