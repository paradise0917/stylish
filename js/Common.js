
/* Common Function JavaScript */

// ----------------------------------------------
//  Common Variable
// ----------------------------------------------
const Config = {
    HostName : "api.appworks-school.tw",
    API_URL : `https://api.appworks-school.tw/api/1.0/`,
    TapPay : {
        APP_ID: 12348,
        APP_KEY: "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
        ServerType: "sandbox"
    }
};

let App = {
    FB: {
        AppID: "2350639674982135",
        Version: "v3.3",
        LoginState: false,
        AccessToken: "",
        User: {
            id: "",
            name: "",
            email: "",
            picurl: ""
        }
    },
    API: {
        Type: "marketing", //Default 
        Detail: "campaigns", //Default
        Method: "GET", //Default
        ContentType: "application/json",
        Body: "",
        QueryPara: []
    },
    Prodcut: {
        Stock: [],
        SelectedItemStockCount: 0,
        SelectedColor: { color: "", name: "" },
        SelectedSize: "",
        SelectedCounts: 0
    },
    cart: {
        prime: "",
        order: {
            userid: "",
            shipping: "delivery",
            payment: "credit_card",
            subtotal: 0,
            freight: 60,
            total: 0,
            recipient: {
                name: "",
                phone: "",
                email: "",
                address: "",
                time: ""
            },
            list: []
        }
    },
    user: {},
    Paging: 0,
    IntroductionIndex: 0,
    access_token: "",
    access_expired: "",
    CartReady: false,
    ReceiveReady: false,
    TabPayReady: false
}

const obj = {
    search_input_desktop : lib.ele("#search_input_desktop"),
    search_input_mobile : lib.ele("#search_input_mobile"),
    deletebtn : lib.ele("#search_delete_desktop"),
    AllSubmitBtn : lib.eleAll("[type=submit]"),
    ProductParentElement : lib.ele("#product_box"),
    Introduction : lib.ele("#introduction")
}
let AllIntroductionImg, AllIntroductionBox, AllIntroductionDot, IntroductionInterval;


// ----------------------------------------------
//  API Connection
// ----------------------------------------------
function EstablishAPIConnection(Type, Keyword) {

    // Set Type Style
    let ProductLink = lib.eleAll(".product-type-link");
    for (let i = 0; i < ProductLink.length; i++) {
        ProductLink[i].classList.remove("isActive");
    }

    App.API.Type = "products"; //Default
    App.API.Detail = Type;
    App.API.Method = "GET";
    App.API.QueryPara = [];

    switch (Type) {
        case "all":
            {
                lib.RemoveElement("product_box");
                CallAPI(CreateProductElement);
            }
            break;
        case "women":
        case "men":
        case "accessories":
            {
                let ProductLinkByType = lib.eleAll("[name='" + Type + "']");
                for (let i = 0; i < ProductLinkByType.length; i++) {
                    ProductLinkByType[i].classList.add("isActive");
                }
                lib.RemoveElement("product_box");
                CallAPI(CreateProductElement);
            }
            break;
        case "search":
            {
                App.API.QueryPara = [{ key: "keyword", value: Keyword }];
                lib.RemoveElement("product_box");
                CallAPI(CreateProductElement);
            }
            break;
        case "details":
            {
                App.API.QueryPara = [{ key: "id", value: Keyword }];
                CallAPI(CreateProductDetailElement);
            }
            break;
        case "checkout":
            {
                App.API.Type = "order";
                App.API.Detail = Type;

                App.API.Method = "POST";
                CallAPI(ReceiveCheckoutResult);
            }
            break;
        default:
            {
                console.log(`[common.js] EstablishAPIConnection function not define this type${Type}`);
            }
            break;
    }
}

function CallAPI(callback) {

    // URL Processing
    let src = Config.API_URL + App.API.Type + "/" + App.API.Detail;
    if (App.API.QueryPara.length > 0) {

        src += "?";
        for (let i = 0; i < App.API.QueryPara.length; i++) {
            src += `${App.API.QueryPara[i].key}=${App.API.QueryPara[i].value}`;
            if (i < App.API.QueryPara.length - 1) {
                src += "&";
            }
        }
    }

    //Set Header and Body
    let API_Header = {
        method: App.API.Method
    };

    if (App.API.Method === "POST") {
        if (App.FB.AccessToken === "") {
            API_Header.headers = { 'Content-Type': App.API.ContentType };
        }
        else {
            API_Header.headers = {
                'Content-Type': App.API.ContentType,
                'Authorization': `Bearer ${App.FB.AccessToken}`
            };
        }
        API_Header.body = App.API.Body
    }

    //Call API
    fetch(src, API_Header).then((res) => {
        return res.json();
    }).then((result) => {
        callback(result);
    }).catch((result) => {
        console.log("[Common.js] Connected API Error. Please check the error log.");
        console.log("error :", result);
    });;

}

// ----------------------------------------------
//  Local Storage 
// ----------------------------------------------
function SetLocalStorage(Key, Para) {
    localStorage.setItem(Key, JSON.stringify(Para));
}

function GetLocalStorage(Key) {
    return JSON.parse(localStorage.getItem(Key));
}

function RemoveLocalStorage(key) {
    localStorage.removeItem(key);
}

// ----------------------------------------------
//  Scroll Handle
// ----------------------------------------------

function HandleScrollEvent() {
    let product_bottom = obj.ProductParentElement.getBoundingClientRect().bottom;
    if (product_bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        //Call to display next page
        if (App.Paging > 0) {
            DisplayNextPage();
            window.removeEventListener("scroll", HandleScrollEvent);
        }
    }
}

function DisplayNextPage() {

    if (App.Paging > 0) {

        let OldPageing = App.API.QueryPara.findIndex(item => item.key === "paging");
        if (OldPageing > -1) {
            App.API.QueryPara[OldPageing] = { key: "paging", value: App.Paging };
        }
        else {
            App.API.QueryPara.push({ key: "paging", value: App.Paging });
        }
    }
    CallAPI(CreateProductElement);

}


// ----------------------------------------------
//  About Products Functions
// ----------------------------------------------

function SearchProduct() {

    let keyword_vlaue = obj.search_input_desktop.value.trim();
    let keyword_vlaue_mobile = obj.search_input_mobile.value.trim();

    //Change the search button to disable until the query complete.
    DisableSubmitButton();

    if (keyword_vlaue === "" && keyword_vlaue_mobile === "") {
        RedirectPage("");
    }
    else if (keyword_vlaue === "" && keyword_vlaue_mobile !== "") {
        RedirectPage('search', keyword_vlaue_mobile);
    }
    else {
        RedirectPage('search', keyword_vlaue);
    }
}

function DisplaySearchBar() {

    lib.ele("#search_icon_find").classList.add("ishidden");
    lib.ele("#search_icon_close").classList.remove("ishidden");
    lib.ele("#searchbar_mobile").classList.remove("ishidden");
    window.setTimeout(function () {
        lib.ele("#searchbar_mobile").setAttribute("style", "width: 100%; opacity: 1;");
        obj.search_input_mobile.focus();
    }, 10);

}

function CloseSearchBar() {

    lib.ele("#search_icon_find").classList.remove("ishidden");
    lib.ele("#search_icon_close").classList.add("ishidden");
    lib.ele("#searchbar_mobile").classList.add("ishidden");
    lib.ele("#searchbar_mobile").setAttribute("style", "width: 0%; opacity: 0;");
    obj.search_input_mobile.value = "";
}

function DisableSubmitButton() {
    obj.AllSubmitBtn.forEach(item => {
        item.setAttribute("disabled", "disabled");
    });
}

function EnableSubmitButton() {
    obj.AllSubmitBtn.forEach(item => {
        item.removeAttribute("disabled");
    });
}


// ----------------------------------------------
//  About FB Login
// ----------------------------------------------

function InitFBSetting() {
    return new Promise((resolve, reject) => {

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')
        );

        window.fbAsyncInit = function () {
            FB.init({
                appId: App.FB.AppID,
                cookie: true,
                xfbml: true,
                version: App.FB.Version
            });
            FB.AppEvents.logPageView();
            console.log("InitFBSetting");
            resolve();
        }
    });
}

function CheckLoginState() {
    return new Promise((resolve, reject) => {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                App.FB.LoginState = true;
                App.FB.AccessToken = response.authResponse.accessToken;
            }
            else {
                App.FB.LoginState = false;
                App.FB.AccessToken = "";
            }
            console.log("CheckLoginState");
            resolve();
        })
    });
}

function GetFBUserInfo() {
    return new Promise((resolve, reject) => {
        FB.api('/me?fields=id,name,email,picture.width(500).height(500)', function (response) {
            App.FB.User.id = response.id;
            App.FB.User.name = response.name;
            App.FB.User.email = response.email;
            App.FB.User.picurl = response.picture.data.url;
            resolve();
        });
    });
}

function LoginFB(redirect_page) {
    FB.login(function (response) {
        if (response.authResponse) {
            if (redirect_page) {
                // Redirect profile page
                RedirectPage("profile");
            } else {
                //Display 
                DisplayUserInfo(response);
            }
        }
    }, {
            scope: 'public_profile,email,user_photos'
        });
}

function LogoutFB() {
    FB.logout(function (response) {
        RedirectPage("index");
    });
}

function LogoutFBConfirm() {
    //Display Message
    let message = {
        type: "confrim",
        text: ["確定要登出嗎？"],
        dofunction: `LogoutFB();`,
        dofunction_2: `CloseMessageBox();`,
        autoclose: false
    };
    lib.CreateMessage(message);
}

// ----------------------------------------------
//  About Member
// ----------------------------------------------
function RedirectProfilePage() {
    let CheckState = CheckLoginState();
    CheckState.then((res) => {
        if (App.FB.LoginState) {
            RedirectPage("profile");
        }
        else {
            LoginFB(true);
        }
    })
}



// ----------------------------------------------
//  About Shopping Cart
// ----------------------------------------------
function GetShoppingCartList() {

    let localStorage_cart = GetLocalStorage("cart");
    let CartCounts = lib.eleAll("span[name=cart-counts]");
    if (localStorage_cart === null || localStorage_cart.order.list.length === 0) {
        CartCounts.forEach(e => e.textContent = 0);
        //Initialize it to an empty structure
        App.cart.order.list = [];
    }
    else {
        App.cart.order.list = localStorage_cart.order.list
        CartCounts.forEach(e => {
            e.textContent = localStorage_cart.order.list.length;
        });
    }
}

// ----------------------------------------------
//  About URL
// ----------------------------------------------
function GetURLParamenter(para) {
    let url = new URL(window.location.href);
    let val = url.searchParams.get(para);
    return val;
}

function RedirectPage(type, para) {
    let url = "";
    switch (type) {
        case "detail":
            {
                url = `product.html?id=${para}`;
            }
            break;
        case "category":
            {
                url = `index.html?category=${para}`;
            }
            break;
        case "search":
            {
                url = `index.html?search=${para}`;
            }
            break;
        case "cart":
            {
                url = `cart.html`;
            }
            break;
        case "thanks":
            {
                url = `thanks.html?number=${para}`;
            }
            break;
        case "profile":
            {
                url = `profile.html`;
            }
            break;
        default:
            {
                url = "index.html";
            }
            break;

    }
    window.location = url;
}

// ----------------------------------------------
//  About Check Functions
// ----------------------------------------------
function isPostiveInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

function isNullorUndefined(obj) {
    if (obj === null || obj === undefined) {
        return true;
    }
    else {
        return false;
    }
}


// ----------------------------------------------
//  Other Functions
// ----------------------------------------------
function ClearInput(id) {
    lib.ele("#" + id).value = "";
    lib.ele("#" + id).focus();
    obj.deletebtn.classList.add("ishidden");
    obj.search_input_desktop.setAttribute("style", "left : 15px;");
}

function ResetMultipleObject(obj) {
    for (var key in obj) {
        obj[key] = "";
    }
}

function CopyText(event) {

    let temp_input = [{
        type: "input",
        attr: [
            { key: "id", value: "temp" },
            { key: "value", value: event.textContent }]
    }];
    lib.CreateElemnt(temp_input, document.body);
    lib.ele("#temp").select();
    document.execCommand('copy', false);
    lib.ele("#temp").remove();
    return false;
}

function ControlLoading(display) {
    if (display === true) {
        lib.ele("#mask").classList.remove("ishidden");
        lib.ele("#loading").classList.remove("ishidden");
    }
    else {
        lib.ele("#mask").classList.add("ishidden");
        lib.ele("#loading").classList.add("ishidden");
    }
}

function CloseMessageBox() {
    // Hide mask
    lib.ele("#mask").classList.add("ishidden");

    // Hide Message
    lib.ele("#message_box").classList.add("ishidden");
}

// ----------------------------------------------
//  Event Listener
// ----------------------------------------------

window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
        CloseSearchBar();
    }
});

window.onbeforeunload = function () {
    //Reset Page Scroll Top
    window.scrollTo(0, 0);
}

obj.search_input_desktop.addEventListener("keyup", () => {

    if (obj.search_input_desktop.value !== "") {
        obj.deletebtn.classList.remove("ishidden");
        obj.search_input_desktop.setAttribute("style", "left : 30px;");
    }
    else {
        obj.deletebtn.classList.add("ishidden");
        obj.search_input_desktop.setAttribute("style", "left : 15px;");
    }

});

obj.search_input_desktop.addEventListener("focus", () => obj.search_input_mobile.value = "");

obj.search_input_mobile.addEventListener("focus", () => {
    obj.search_input_desktop.value = "";
    ClearInput('search_input_desktop');
});