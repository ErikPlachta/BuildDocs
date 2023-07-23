function ManageHtmlContent() {
  /**
   * Managing when a main navigational element is selected.
   *
   * 1. Update the main nav's active tab.
   * 2. Show / hide the main nav's content based on the selected group from nav-main li.
   */
  function handleMainNav(groupId: any) {
    // 1. Update the main nav's active tab.
    document.querySelectorAll("[data-role='nav-header-link']").forEach((navMainLink: any) => {
      if (navMainLink?.dataset.group == groupId) {
        navMainLink?.classList.remove('border-transparent')
        navMainLink?.classList.add('border-b-blue-500')
      } else {
        navMainLink?.classList.remove('border-b-blue-500')
        navMainLink?.classList.add('border-transparent')
      }
    })

    // 2. Show / hide wrapper for content group.
    document.querySelectorAll("[data-role='group-content-wrapper']").forEach((content: any) => {
      // If the content's group matches the selected group, show it.
      if (content.dataset.group == groupId) {
        content?.classList.remove('hidden')
      } else {
        content?.classList.add('hidden')
      }
    })

    // 3. Show / hide content within the group-wrapper.
    document.querySelectorAll("[data-role='group-content']").forEach((content: any) => {
      // If the content's group matches the selected group, show it.
      if (content.dataset.group == groupId) {
        content?.classList.remove('hidden')
      } else {
        content?.classList.add('hidden')
      }
    })
  } // end of handleMainNav.

  /**
   * Get all tabs for role tab-strip-nav and toggle active tab and content based on selected tab ID.
   */
  function handleTabStrip(tabId: string, dataset: any) {
    // 1. Updating the Tab Strip's active tab.
    document.querySelectorAll("[data-role='tab-strip-nav-link']").forEach((tab: any) => {
      if (tabId == tab.id) {
        tab?.classList.remove('bg-opacity-30')
        tab?.classList.add('bg-opacity-100')
        tab?.classList.add('border-b-blue-500')
      } else {
        tab?.classList.remove('bg-opacity-100')
        tab?.classList.add('bg-opacity-30')
        tab?.classList.remove('border-b-blue-500')
      }
    })

    // 2. Show / Hide content based on selected tab.
    document.querySelectorAll(`[data-group="${dataset.group}"] [data-role="content"]`).forEach((content: any) => {
      // The selected tab's data-id value matches the content's data-id value, show it.
      if (content.dataset.id == dataset.id) {
        content.classList.remove('hidden')
      }
      // Otherwise hide it.
      else {
        content.classList.add('hidden')
      }
    })
  } // end of handleTabStrip.

  /**
   * Adding navigational event listeners for main nav and tab strips.
   */
  function addEventListeners() {
    // Listen for main navigation elements to be selected and active state.
    document.querySelectorAll("[data-role='nav-header-link']").forEach((navLink: any) => {
      navLink.addEventListener('click', (e: any) => {
        handleMainNav(navLink.dataset.group)
      })
    })

    // Listeners for when tab in tab-strip is selected to toggle content visibility.
    document.querySelectorAll("[data-role='tab-strip-nav']").forEach((tab: any) => {
      tab.addEventListener('click', (e: any) => {
        handleTabStrip(e.target.id, e.target.dataset)
      })
    })
  }

  // When the DOM is loaded, add event listeners.
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded')
    addEventListeners()
    console.log('ManageHtmlContent')
  })
}

export default ManageHtmlContent
