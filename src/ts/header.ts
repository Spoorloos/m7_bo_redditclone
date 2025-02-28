const sideBar = document.querySelector<HTMLElement>("aside")!;
const hideSideBarButton = document.querySelector<HTMLButtonElement>("#hide-sidebar-button")!;

hideSideBarButton.addEventListener("click", () => {
    sideBar.toggleAttribute("hidden");
})