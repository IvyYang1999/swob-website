(() => {
  const root = document.documentElement
  const lang = root.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
  const themeKey = 'swob-docs-theme'
  const navStateKey = `swob-docs-nav-open-v1:${lang}`
  const scriptUrl = new URL(document.currentScript?.src || './docs.js', window.location.href)
  const docsRoot = new URL('../', scriptUrl)

  const icons = {
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 15.5A8.5 8.5 0 0 1 8.5 3.8 8.5 8.5 0 1 0 20.2 15.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  }

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem(themeKey)
      return value === 'light' || value === 'dark' ? value : null
    } catch {
      return null
    }
  }

  const preferredTheme = () => getStoredTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#17151b' : '#fdfcff')
    if (persist) {
      try { localStorage.setItem(themeKey, theme) } catch {}
    }
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(theme === 'dark'))
      button.setAttribute('aria-label', lang === 'zh' ? `切换到${theme === 'dark' ? '浅色' : '深色'}模式` : `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`)
      button.innerHTML = `${theme === 'dark' ? icons.sun : icons.moon}<span class="docs-theme-label">${lang === 'zh' ? '外观' : 'Theme'}</span>`
    })
  }

  setTheme(preferredTheme())

  const normalizePath = (pathname) => pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/'

  const getOpenNavigationGroups = () => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(navStateKey) || '[]')
      return new Set(Array.isArray(stored) ? stored.filter((value) => typeof value === 'string') : [])
    } catch {
      return new Set()
    }
  }

  const saveOpenNavigationGroups = (groups) => {
    try { sessionStorage.setItem(navStateKey, JSON.stringify([...groups])) } catch {}
  }

  const navigationGroups = [
    {
      title: { zh: '开始使用', en: 'Start here' },
      pages: [
        { title: { zh: '开始使用 Swob', en: 'Overview' }, zh: 'index.html', en: 'en/index.html' },
        { title: { zh: '5 分钟快速入门', en: 'Quick start' }, zh: 'getting-started/install.html' },
        { title: { zh: '我的工具支持什么', en: 'Supported sources' }, zh: 'sources.html' }
      ]
    },
    {
      title: { zh: '常用任务', en: 'Use Swob' },
      pages: [
        { title: { zh: '阅读会话', en: 'Read sessions' }, zh: 'guides/reading.html' },
        { title: { zh: '搜索与 Spotlight', en: 'Search' }, zh: 'guides/search.html' },
        { title: { zh: '继续历史会话', en: 'Resume sessions' }, zh: 'guides/resume.html', en: 'en/guides/resume.html' },
        { title: { zh: '整理会话', en: 'Organize and undo' }, zh: 'guides/organize.html' },
        { title: { zh: 'Lens 与文件夹', en: 'Lenses and folders' }, zh: 'concepts/lenses-folders.html' },
        { title: { zh: 'SSH 远程续接', en: 'SSH resume' }, zh: 'guides/ssh.html' }
      ]
    },
    {
      title: { zh: '理解与分析', en: 'Learn more' },
      pages: [
        { title: { zh: 'Context 与执行树', en: 'Context and execution' }, zh: 'guides/context-execution.html' },
        { title: { zh: '血统与会话图谱', en: 'Lineage' }, zh: 'concepts/lineage.html' },
        { title: { zh: '用 Insights 回答问题', en: 'Insights' }, zh: 'guides/insights.html' },
        { title: { zh: '指标与成本口径', en: 'Metrics' }, zh: 'metrics.html' },
        { title: { zh: '数据可信度', en: 'Evidence and trust' }, zh: 'concepts/evidence.html' },
        { title: { zh: '备份与安全复活', en: 'Backup and recovery' }, zh: 'concepts/recovery.html' }
      ]
    },
    {
      title: { zh: '自动化与支持', en: 'Settings and support' },
      pages: [
        { title: { zh: 'AI 与全局 Agent', en: 'AI profiles' }, zh: 'guides/profiles.html' },
        { title: { zh: 'CLI 自动化', en: 'CLI workflows and reference' }, zh: 'guides/cli.html' },
        { title: { zh: 'Library Health 与诊断', en: 'Diagnostics' }, zh: 'guides/diagnostics.html' },
        { title: { zh: 'Library 与数据边界', en: 'Vault' }, zh: 'concepts/vault.html' },
        { title: { zh: '隐私、网络与脱敏', en: 'Privacy' }, zh: 'privacy.html' },
        { title: { zh: '按症状排障', en: 'Troubleshooting' }, zh: 'troubleshooting.html' }
      ]
    }
  ]

  const buildNavigation = () => {
    const current = normalizePath(window.location.pathname)
    const availableGroups = navigationGroups.map((group) => ({
      ...group,
      pages: group.pages.filter((page) => page[lang])
    })).filter((group) => group.pages.length)
    let activeGroupIndex = availableGroups.findIndex((group) => group.pages.some((page) => {
      const target = normalizePath(new URL(page[lang], docsRoot).pathname)
      return target === current
    }))
    if (activeGroupIndex < 0) activeGroupIndex = 0
    const openGroups = getOpenNavigationGroups()

    const createTree = (label) => {
      const nav = document.createElement('nav')
      nav.className = 'docs-tree'
      nav.setAttribute('aria-label', label)
      availableGroups.forEach((group, groupIndex) => {
        const groupId = group.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const details = document.createElement('details')
        details.className = 'docs-nav-group'
        details.open = groupIndex === activeGroupIndex || openGroups.has(groupId)
        details.dataset.navGroup = groupId
        const summary = document.createElement('summary')
        summary.textContent = group.title[lang]
        details.append(summary)
        const links = document.createElement('div')
        links.className = 'docs-nav-links'
        group.pages.forEach((page) => {
          const link = document.createElement('a')
          link.href = new URL(page[lang], docsRoot).href
          link.textContent = page.title[lang]
          const target = normalizePath(new URL(link.href).pathname)
          if (target === current) link.setAttribute('aria-current', 'page')
          links.append(link)
        })
        details.append(links)
        details.addEventListener('toggle', () => {
          const nextOpenGroups = getOpenNavigationGroups()
          if (details.open) nextOpenGroups.add(groupId)
          else nextOpenGroups.delete(groupId)
          saveOpenNavigationGroups(nextOpenGroups)
        })
        nav.append(details)
      })
      const references = document.createElement('div')
      references.className = 'docs-nav-links'
      const links = lang === 'en'
        ? [['/docs/', 'More docs (中文)'], ['/sources', 'Current source matrix'], ['/#download', 'Download for macOS']]
        : [['/docs/en/', 'English guides']]
      links.forEach(([href, title]) => {
        const link = document.createElement('a')
        link.href = href
        link.textContent = title
        references.append(link)
      })
      nav.append(references)
      return nav
    }

    const sidebar = document.querySelector('.docs-sidebar')
    if (sidebar) {
      sidebar.replaceChildren(createTree(lang === 'zh' ? '文档目录' : 'Documentation'))
      requestAnimationFrame(() => sidebar.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' }))
    }

    const mobile = document.querySelector('.mobile-chapters')
    if (mobile) {
      const activeGroup = availableGroups[activeGroupIndex]
      const activePage = activeGroup.pages.find((page) => normalizePath(new URL(page[lang], docsRoot).pathname) === current)
      const summary = document.createElement('summary')
      summary.innerHTML = `<span>${activeGroup.title[lang]}</span><strong>${activePage?.title[lang] || (lang === 'zh' ? '文档目录' : 'Documentation')}</strong>`
      mobile.replaceChildren(summary, createTree(lang === 'zh' ? '移动端文档目录' : 'Mobile documentation'))
    }
  }

  const markCurrentNavigation = () => {
    const current = normalizePath(window.location.pathname)
    document.querySelectorAll('.docs-tree a').forEach((link) => {
      const target = normalizePath(new URL(link.href, window.location.href).pathname)
      if (target === current) link.setAttribute('aria-current', 'page')
      else if (link.getAttribute('aria-current') === 'page') link.removeAttribute('aria-current')
    })
  }

  const addDocumentMeta = () => {
    const hero = document.querySelector('.doc-hero')
    const content = document.querySelector('.docs-content')
    if (!hero || !content || hero.querySelector('.doc-meta')) return
    const words = content.innerText.trim().replace(/\s+/g, ' ').length
    const minutes = Math.max(1, Math.ceil(words / (lang === 'zh' ? 420 : 1100)))
    const meta = document.createElement('div')
    meta.className = 'doc-meta'
    const readTime = document.createElement('span')
    readTime.textContent = lang === 'zh' ? `约 ${minutes} 分钟阅读` : `${minutes} min read`
    const copyButton = document.createElement('button')
    copyButton.type = 'button'
    copyButton.textContent = lang === 'zh' ? '复制页面链接' : 'Copy page link'
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        copyButton.textContent = lang === 'zh' ? '已复制' : 'Copied'
        setTimeout(() => { copyButton.textContent = lang === 'zh' ? '复制页面链接' : 'Copy page link' }, 1600)
      } catch {
        copyButton.textContent = lang === 'zh' ? '复制失败' : 'Copy failed'
      }
    })
    meta.append(readTime, copyButton)
    hero.append(meta)
  }

  const slugify = (text, index) => {
    const cleaned = text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
    return cleaned || `section-${index + 1}`
  }

  let tocScrollHandler
  const buildToc = () => {
    const layout = document.querySelector('.docs-layout')
    const headings = [...document.querySelectorAll('.docs-content section h2, .docs-content section h3')]
    document.querySelector('.docs-toc')?.remove()
    if (tocScrollHandler) window.removeEventListener('scroll', tocScrollHandler)
    tocScrollHandler = null
    if (!layout || headings.length < 2) return
    const used = new Set()
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const base = slugify(heading.textContent || '', index)
        let value = base
        let suffix = 2
        while (used.has(value)) value = `${base}-${suffix++}`
        heading.id = value
      }
      used.add(heading.id)
    })

    const aside = document.createElement('aside')
    aside.className = 'docs-toc'
    aside.setAttribute('aria-label', lang === 'zh' ? '本页目录' : 'On this page')
    const nav = document.createElement('nav')
    const title = document.createElement('strong')
    title.textContent = lang === 'zh' ? '本页' : 'On this page'
    nav.append(title)
    const links = headings.map((heading) => {
      const link = document.createElement('a')
      link.href = `#${heading.id}`
      link.textContent = heading.textContent || ''
      link.dataset.level = heading.tagName === 'H3' ? '3' : '2'
      nav.append(link)
      return link
    })
    aside.append(nav)
    layout.append(aside)

    const updateActiveHeading = () => {
      const headerOffset = Number.parseFloat(getComputedStyle(root).getPropertyValue('--header-height')) + 48
      let active = headings[0]
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= headerOffset) active = heading
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = headings.at(-1)
      links.forEach((link) => link.setAttribute('aria-current', String(link.getAttribute('href') === `#${active.id}`)))
    }
    let queued = false
    tocScrollHandler = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        updateActiveHeading()
        queued = false
      })
    }
    window.addEventListener('scroll', tocScrollHandler, { passive: true })
    updateActiveHeading()
  }

  const hydrateSourceMatrix = async () => {
    const host = document.querySelector('[data-source-matrix]')
    if (!host) return
    const capabilityColumns = [
      ['transcript', lang === 'zh' ? '正文' : 'Transcript'],
      ['search', lang === 'zh' ? '搜索' : 'Search'],
      ['usage', lang === 'zh' ? '用量' : 'Usage'],
      ['relationships', lang === 'zh' ? '关系' : 'Lineage'],
      ['archive', lang === 'zh' ? '归档' : 'Archive'],
      ['terminal-resume', lang === 'zh' ? '终端续接' : 'Terminal resume'],
      ['native-resume', lang === 'zh' ? '原生入口' : 'Native resume'],
      ['format-provenance', lang === 'zh' ? '格式证据' : 'Provenance']
    ]
    const statusLabels = {
      available: lang === 'zh' ? '可用' : 'Available',
      experimental: lang === 'zh' ? '实验' : 'Experimental',
      unavailable: lang === 'zh' ? '不可用' : 'Unavailable',
      'not-applicable': lang === 'zh' ? '不适用' : 'Not applicable'
    }
    try {
      const response = await fetch(new URL('../source-matrix.json', docsRoot))
      if (!response.ok) throw new Error(String(response.status))
      const matrix = await response.json()
      const table = document.createElement('table')
      table.className = 'source-matrix'
      const thead = document.createElement('thead')
      const headerRow = document.createElement('tr')
      const sourceHead = document.createElement('th')
      sourceHead.textContent = lang === 'zh' ? '来源' : 'Source'
      headerRow.append(sourceHead)
      capabilityColumns.forEach(([, label]) => {
        const th = document.createElement('th')
        th.textContent = label
        headerRow.append(th)
      })
      thead.append(headerRow)
      const tbody = document.createElement('tbody')
      matrix.sources.forEach((source) => {
        const row = document.createElement('tr')
        const name = document.createElement('td')
        const title = document.createElement('strong')
        title.textContent = source.displayName
        const tier = document.createElement('small')
        tier.textContent = source.tier === 'compatible'
          ? (lang === 'zh' ? '兼容格式' : 'Compatible')
          : (lang === 'zh' ? '原生解析' : 'Native')
        name.append(title, tier)
        row.append(name)
        capabilityColumns.forEach(([capability]) => {
          const status = source.capabilities[capability] || 'unavailable'
          const cell = document.createElement('td')
          const badge = document.createElement('span')
          badge.className = `capability-status ${status}`
          badge.textContent = status === 'available' ? '●' : status === 'experimental' ? '◐' : '—'
          badge.title = statusLabels[status] || status
          badge.setAttribute('aria-label', statusLabels[status] || status)
          cell.append(badge)
          row.append(cell)
        })
        tbody.append(row)
      })
      table.append(thead, tbody)
      host.replaceChildren(table)
      document.querySelectorAll('[data-source-count]').forEach((element) => {
        element.textContent = String(matrix.sources.length)
      })
    } catch {
      host.innerHTML = `<p class="docs-inline-error">${lang === 'zh' ? '来源矩阵暂时无法载入。' : 'The source matrix is temporarily unavailable.'}</p>`
    }
  }

  const createSearch = () => {
    const header = document.querySelector('.docs-header')
    if (!header) return

    const tools = document.createElement('div')
    tools.className = 'docs-tools'
    const searchButton = document.createElement('button')
    searchButton.type = 'button'
    searchButton.className = 'docs-tool'
    searchButton.dataset.searchTrigger = 'true'
    searchButton.innerHTML = `${icons.search}<span>${lang === 'zh' ? '搜索' : 'Search'}</span>`
    searchButton.setAttribute('aria-label', lang === 'zh' ? '搜索文档' : 'Search docs')
    searchButton.setAttribute('aria-keyshortcuts', 'Control+K Meta+K')
    const themeButton = document.createElement('button')
    themeButton.type = 'button'
    themeButton.className = 'docs-tool'
    themeButton.dataset.themeToggle = 'true'
    themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true))
    tools.append(searchButton, themeButton)
    header.append(tools)
    setTheme(root.dataset.theme || preferredTheme())

    const dialog = document.createElement('dialog')
    dialog.className = 'docs-search-dialog'
    dialog.setAttribute('aria-label', lang === 'zh' ? '搜索文档' : 'Search docs')
    dialog.innerHTML = `
      <div class="docs-search-head">
        ${icons.search}
        <input class="docs-search-input" type="search" autocomplete="off" spellcheck="false" aria-label="${lang === 'zh' ? '搜索文档' : 'Search docs'}" placeholder="${lang === 'zh' ? '搜索文档…' : 'Search docs…'}">
        <form method="dialog"><button class="docs-search-close" aria-label="${lang === 'zh' ? '关闭搜索' : 'Close search'}">${icons.close}</button></form>
      </div>
      <div class="docs-search-results" aria-live="polite"></div>
      <div class="docs-search-foot"><span>${lang === 'zh' ? '输入关键词查找页面' : 'Type to find a page'}</span><span>Esc ${lang === 'zh' ? '关闭' : 'to close'}</span></div>`
    document.body.append(dialog)
    const input = dialog.querySelector('.docs-search-input')
    const results = dialog.querySelector('.docs-search-results')
    let indexPromise

    const loadIndex = () => {
      if (!indexPromise) {
        indexPromise = fetch(new URL('search-index.json', docsRoot)).then((response) => {
          if (!response.ok) throw new Error(`Search index failed: ${response.status}`)
          return response.json()
        })
      }
      return indexPromise
    }

    const renderResults = async () => {
      const query = input.value.trim().toLocaleLowerCase()
      try {
        const pages = (await loadIndex()).filter((page) => !page.lang || page.lang === lang)
        const ranked = pages.map((page) => {
          const title = page.title.toLocaleLowerCase()
          const haystack = `${page.description} ${page.section} ${page.keywords || ''}`.toLocaleLowerCase()
          const score = !query ? 1 : title.includes(query) ? 3 : haystack.includes(query) ? 2 : 0
          return { page, score }
        }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8)
        results.replaceChildren()
        if (!ranked.length) {
          const empty = document.createElement('p')
          empty.className = 'docs-search-empty'
          empty.textContent = lang === 'zh' ? '没有找到匹配页面' : 'No matching pages'
          results.append(empty)
          return
        }
        ranked.forEach(({ page }) => {
          const link = document.createElement('a')
          link.className = 'docs-search-result'
          link.href = new URL(page.href, docsRoot).href
          const title = document.createElement('strong')
          title.textContent = page.title
          const description = document.createElement('span')
          description.textContent = `${page.section} · ${page.description}`
          link.append(title, description)
          results.append(link)
        })
      } catch {
        results.innerHTML = `<p class="docs-search-empty">${lang === 'zh' ? '搜索暂时不可用' : 'Search is unavailable'}</p>`
      }
    }

    const openSearch = () => {
      if (!dialog.open) dialog.showModal()
      input.value = ''
      renderResults()
      requestAnimationFrame(() => input.focus())
    }
    searchButton.addEventListener('click', openSearch)
    input.addEventListener('input', renderResults)
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close()
    })
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openSearch()
      }
    })
  }

  const destinationLanguage = (url) => {
    const relativePath = url.pathname.startsWith(docsRoot.pathname)
      ? url.pathname.slice(docsRoot.pathname.length)
      : ''
    return relativePath.startsWith('en/') ? 'en' : 'zh'
  }

  const portableContent = (content, pageUrl) => {
    const clone = content.cloneNode(true)
    clone.querySelectorAll('[href], [src]').forEach((element) => {
      for (const attribute of ['href', 'src']) {
        const value = element.getAttribute(attribute)
        if (!value) continue
        try { element.setAttribute(attribute, new URL(value, pageUrl).href) } catch {}
      }
    })
    clone.querySelectorAll('[srcset]').forEach((element) => {
      const value = element.getAttribute('srcset')
      if (!value) return
      const resolved = value.split(',').map((candidate) => {
        const [source, ...descriptor] = candidate.trim().split(/\s+/)
        try { return [new URL(source, pageUrl).href, ...descriptor].join(' ') } catch { return candidate.trim() }
      }).join(', ')
      element.setAttribute('srcset', resolved)
    })
    return clone
  }

  let navigationController
  let navigationSequence = 0

  const fetchDocsPage = async (url, signal) => {
    const requestUrl = new URL(url)
    requestUrl.hash = ''
    const response = await fetch(requestUrl, {
      signal,
      headers: { 'X-Swob-Docs-Navigation': 'partial' }
    })
    if (!response.ok) throw new Error(`Docs navigation failed: ${response.status}`)
    const parsed = new DOMParser().parseFromString(await response.text(), 'text/html')
    const content = parsed.querySelector('.docs-content')
    const parsedLang = parsed.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
    if (!content || parsedLang !== lang) throw new Error('Docs navigation returned an incompatible page')
    return { parsed, content: portableContent(content, requestUrl) }
  }

  const syncDocumentMetadata = (parsed) => {
    document.title = parsed.title
    const nextDescription = parsed.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    document.querySelector('meta[name="description"]')?.setAttribute('content', nextDescription)
    document.body.dataset.section = parsed.body.dataset.section || ''
    const metadata = 'link[rel="canonical"], link[hreflang], meta[name="robots"]'
    document.head.querySelectorAll(metadata).forEach((element) => element.remove())
    parsed.head.querySelectorAll(metadata).forEach((element) => document.head.append(element.cloneNode(true)))
  }

  const scrollAfterNavigation = (url, scrollY = 0) => {
    requestAnimationFrame(() => {
      let hashTarget = null
      try { hashTarget = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1))) } catch {}
      if (hashTarget) hashTarget.scrollIntoView()
      else window.scrollTo(0, scrollY)
    })
  }

  const applyDocsPage = ({ parsed, content }, url, scrollY) => {
    const currentContent = document.querySelector('.docs-content')
    if (!currentContent) throw new Error('Current documentation content is missing')
    currentContent.replaceWith(content)
    syncDocumentMetadata(parsed)
    buildNavigation()
    markCurrentNavigation()
    addDocumentMeta()
    buildToc()
    hydrateSourceMatrix()
    document.querySelector('.docs-search-dialog[open]')?.close()
    const mobile = document.querySelector('.mobile-chapters')
    if (mobile) mobile.open = false
    content.setAttribute('tabindex', '-1')
    content.focus({ preventScroll: true })
    content.addEventListener('blur', () => content.removeAttribute('tabindex'), { once: true })
    scrollAfterNavigation(url, scrollY)
  }

  const navigateDocs = async (url, options = {}) => {
    const sequence = ++navigationSequence
    navigationController?.abort()
    navigationController = new AbortController()
    document.querySelector('.docs-content')?.setAttribute('data-navigation', 'loading')
    try {
      const page = await fetchDocsPage(url, navigationController.signal)
      if (sequence !== navigationSequence) return
      if (!options.fromHistory) {
        history.replaceState({ ...(history.state || {}), docsPage: true, scrollY: window.scrollY }, '', window.location.href)
        history.pushState({ docsPage: true, scrollY: 0 }, '', url)
      }
      applyDocsPage(page, url, options.scrollY || 0)
    } catch (error) {
      if (error.name === 'AbortError') return
      if (options.fromHistory) window.location.reload()
      else window.location.assign(url.href)
    } finally {
      if (sequence === navigationSequence) {
        document.querySelector('.docs-content')?.removeAttribute('data-navigation')
      }
    }
  }

  const shouldHandleDocsLink = (event, link, url) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
    if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return false
    if (url.origin !== window.location.origin || !url.pathname.startsWith(docsRoot.pathname)) return false
    if (destinationLanguage(url) !== lang) return false
    return /(?:\.html)?\/?$/.test(url.pathname)
  }

  const installClientNavigation = () => {
    if (!history.pushState || !window.fetch || !window.DOMParser) return
    history.scrollRestoration = 'manual'
    history.replaceState({ ...(history.state || {}), docsPage: true, scrollY: window.scrollY }, '', window.location.href)

    document.addEventListener('click', (event) => {
      const link = event.target.closest?.('a[href]')
      if (!link) return
      const url = new URL(link.href, window.location.href)
      if (!shouldHandleDocsLink(event, link, url)) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        if (url.hash) return
        event.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      event.preventDefault()
      navigateDocs(url)
    })

    let scrollStateQueued = false
    window.addEventListener('scroll', () => {
      if (scrollStateQueued) return
      scrollStateQueued = true
      requestAnimationFrame(() => {
        history.replaceState({ ...(history.state || {}), docsPage: true, scrollY: window.scrollY }, '', window.location.href)
        scrollStateQueued = false
      })
    }, { passive: true })

    window.addEventListener('popstate', (event) => {
      navigateDocs(new URL(window.location.href), {
        fromHistory: true,
        scrollY: Number.isFinite(event.state?.scrollY) ? event.state.scrollY : 0
      })
    })
  }

  const media = matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener?.('change', () => { if (!getStoredTheme()) setTheme(preferredTheme()) })
  buildNavigation()
  markCurrentNavigation()
  addDocumentMeta()
  buildToc()
  createSearch()
  hydrateSourceMatrix()
  installClientNavigation()
})()
