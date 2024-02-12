
//Change visibility of the loading screen
export function hideLoadingScreen() {
    var screenLoading = document.getElementById("Loading");
    screenLoading.style.display = "none";
}

//Change visibility of the loading screen during 2 seconds
export function showLoadingScreen() {
    var screenLoading = document.getElementById("Loading");
    screenLoading.style.display = "initial";
    setTimeout(hideLoadingScreen, 2000);
}