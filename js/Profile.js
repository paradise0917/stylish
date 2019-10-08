/* This JavaScript is only for profile.html */

function CheckProfileLoginState(){
    if(App.FB.LoginState){
        GetFBUserInfo().then(() => {DisplayUserInfo()});
    }
    else{

        //Display Message
        let message = {
            type : "alert",
            text : ["請先使用 Facebook 帳號登入"],
            dofunction : "RedirectPage('index')",
            autoclose : false
        }
        lib.CreateMessage(message);

    }   
}

function DisplayUserInfo(){
    lib.ele("#user_id").textContent = App.FB.User.id;
    lib.ele("#user_name").textContent = App.FB.User.name;
    lib.ele("#user_email").textContent = App.FB.User.email;
    lib.ele("#user_picure").setAttribute("src",App.FB.User.picurl);
    //Close Loading 
    ControlLoading(false);
}


// ----------------------------------------------
//  Event Listener
// ----------------------------------------------
window.addEventListener("load",() => {

    //Step1. Display Loading
    ControlLoading(true);

    //Step2. Update Shopping Cart Icon
    GetShoppingCartList();

    //Step3. Init FB Setting
    const InitFBLogin = async () => {
        await InitFBSetting();
        await CheckLoginState();
    }
    InitFBLogin()
    .then(() => { CheckProfileLoginState()})
    .catch(response => {console.log(response);});

});
