/* This JavaScript is only for thanks.html */

// ----------------------------------------------
//  Event Listener
// ----------------------------------------------
window.addEventListener("load",() => {

    //Step1. Get URL Para
    let order_number = GetURLParamenter("number");

    //Step2. Display 
    lib.ele("#order_number").textContent = order_number;

    //Step3. Update Shopping Cart Icon
    GetShoppingCartList();

    //Step4. Init FB Setting 
    InitFBSetting();

});
