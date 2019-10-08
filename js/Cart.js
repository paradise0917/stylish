/* This JavaScript is only for cart.html */

// ----------------------------------------------
//  Main Functions
// ----------------------------------------------
function CreateCartItem()
{
    let localStorage_cart = GetLocalStorage("cart");  
    let cart_item_block = lib.ele("#cart_item_block");
    let price_total = 0;

    if (localStorage_cart == null || localStorage_cart.order.list.length === 0) {
        CreateCartEmptyDisplay();
    }
    else{

        let product_item = [];
        let index_id = 0;
        localStorage_cart.order.list.forEach((item) => {

            //Create item image
            let product_img = {
                type : "div",
                attr :[{key: "class",value:"item-img"}],
                child : [{
                    type : "IMG",
                    attr :[
                            {key : "alt",value : "product-img"},
                            {key : "src",value : item.main_image}]
                }]
            };

            //Create Item Detail
            let item_detail = {
                type : "div",
                attr :[{key : "class",value : "item-detail"}],
                child : [{
                            type : "div",
                            attr :[{key : "class",value : "title"}],
                            content : [`${item.name}`]
                        },
                        {
                            type : "div",
                            attr :[{key : "class",value : "id"}],
                            content : [`${item.id}`]
                        },
                        {
                            type : "div",
                            attr :[{key : "class",value : "color"}],
                            content : [`顏色 | ${item.color.name}`]
                        },
                        {
                            type : "div",
                            attr :[{key : "class",value : "size"}],
                            content : [`尺寸 | ${item.size}`]
                        }]
            };

            //Create item-info-block
            let item_info_block = {
                type : "div",
                attr :[{key : "class",value : "item-info-block"}],
                child : [product_img ,item_detail]
            };   


            // Create Stock Select Option
            let select_option_array =[];
            for (let i = 1; i <= item.stock; i++){
                if(i==item.qty){
                    select_option_array.push({
                        type : "option",
                        attr :[{key: "value",value: i},{key : "text",value : i},{key: "selected", value: "true"}]
                    });
                }
                else{
                    select_option_array.push({
                        type : "option",
                        attr :[{key: "value",value: i},{key : "text",value : i}],
                    });
                }
            };


            // Create item-select
            let item_select ={
                type : "div",
                attr :[{key : "class",value : "item-select"}],
                child : [{
                    type : "span",
                    attr :[{key : "class",value : "title-mobile"}],
                    content : ["數量"]
                },{
                    type : "select",
                    attr :[{key : "class",value : "ddl-counts"},
                    {key : "onchange",value : `ChangeProductCounts('item_${index_id}')`}],
                    child : select_option_array
                }]
            };

            // Create item-price
            let item_price = {
                type : "div",
                attr :[{key : "class",value : "item-price"}],
                child : [{
                    type : "span",
                    attr :[{key : "class",value : "title-mobile"}],
                    content : ["單價"]
                },
                {
                    type : "span",
                    attr : [{key : "name",value : "item-unitprice"}],
                    content : [`NT. ${item.price}`]
                }]
            };

            // Create item-total-price
            let item_total_price = {
                type : "div",
                attr :[{key : "class",value : "item-total-price"}],
                child : [{
                    type : "span",
                    attr :[{key : "class",value : "title-mobile"}],
                    content : ["小計"]
                },
                {
                    type : "span",
                    attr :[{key : "name",value : "item-subtotal"}],
                    content : [`NT. ${item.price * item.qty}`]
                }]
            };

            price_total += item.price * item.qty;
            // Create item-other-block
            let item_other_block = {
                type : "div",
                attr :[{key : "class",value : "item-other-block"}],
                child : [item_select ,item_price ,item_total_price]
            };   

            // Create item-icon
            let item_icon = {
                type : "div",
                attr :[{key : "class",value : "item-icon"}],
                child : [{
                    type : "IMG",
                    attr :[{key : "class",value : "icon-delete"},
                    {key : "class",value : "pointer"},
                    {key : "class",value : "transition-bigger"},
                    {key : "src", value : "style/images/cart-remove.png"},
                    {key : "alt", value: "delete-icon"},
                    {key : "onclick", value:`RemoveProduct('item_${index_id}')`}]
                }]
            }

            // Create item-block
            let item_block = {
                type : "div",
                attr :[{key : "class",value : "cart-item"},
                {key : "id",value : `item_${index_id}`}],
                child : [item_info_block ,item_other_block, item_icon]
            };   

            product_item.push(item_block);
            index_id++;
        });

        let parent_obj = lib.ele("#cart_item_block");
        lib.CreateElemnt(product_item ,parent_obj);

        //Update Global Variable
        App.CartReady = true;
        UpdatePriceTotalItemInfo(price_total ,localStorage_cart.order.list.length);
       
    }

    

}

// User Change the Product Counts
// Step1. Change HTML Elements
// Step2. Update localStorage
function ChangeProductCounts(id){
    
    let unitprice = lib.ele(`#${id} span[name=item-unitprice]`).textContent.replace("NT. ","");
    let qty = lib.ele(`#${id} .ddl-counts`).options[lib.ele(`#${id} .ddl-counts`).selectedIndex].text;
    let subtotal = lib.ele(`#${id} span[name=item-subtotal]`);

    //Step1. Update Subtotal and Total Price
    subtotal.textContent = `NT. ${Number(unitprice) * Number(qty)}`;

    // Recaulation Total Price
    RecaculateTotalInfo();

    //Step2. Update localStorage
    UpdatelocalStorage("update", id, qty);

}

// User Remove the Product
// Step1. Update localStorage
// Step2. Update Cart Icon
// Step3. Remove HTML Elements
function ExecuteRemoveProduct(id){

     // Step1. Update localStorage
     UpdatelocalStorage("delete" ,id);

     // Step2. Update Cart Icon
     GetShoppingCartList();

     // Step3. Remove HTML Elements
     let item = lib.ele(`#${id}`);
     item.style.cssText = "opacity: 0;";
     window.setTimeout(()=>{

         item.parentElement.removeChild(item);
         if(lib.eleAll(".cart-item").length === 0){
             CreateCartEmptyDisplay();
         }
         else{
             //Update Global Variable
             App.CartReady = true;
         }

         //Step3. Recaculate Total Price
         RecaculateTotalInfo();

     },500);   

}

function RemoveProduct(id){

    //Display Message
    let message = {
        type : "remove_item",
        text :["確定要從購物車移除這個商品嗎？"],
        dofunction : `ExecuteRemoveProduct('${id}');CloseMessageBox();`,
        dofunction_2 : "CloseMessageBox()",
        autoclose : false
    };
    lib.CreateMessage(message);

}

function UpdatelocalStorage(type ,id, para){

    //Check is insert or update
    let localStorage_cart = GetLocalStorage("cart");
    if (localStorage_cart === null) {
        alert("Oops! Some error occur :(");
    }
    else{
        let P_ID = lib.ele(`#${id} .item-detail .id`).textContent;
        let P_Color = lib.ele(`#${id} .item-detail .color`).textContent.replace("顏色 | ","");
        let P_Size = lib.ele(`#${id} .item-detail .size`).textContent.replace("尺寸 | ","");

        let ExistPrductIndex = localStorage_cart.order.list.findIndex(item => 
            (item.id == P_ID
            && item.color.name == P_Color
            && item.size == P_Size)
        );     

        if(type === "update"){
            localStorage_cart.order.list[ExistPrductIndex].qty = Number(para);
        }
        else{
            localStorage_cart.order.list.splice(ExistPrductIndex, 1);           
        }

        //Update LocalStorage and Global Variable
        SetLocalStorage("cart", localStorage_cart);
        App.cart.order.list = localStorage_cart.order.list;
    }
}

function RecaculateTotalInfo(){
    let newTotalPrice = 0;
    let subtotalItemArray = lib.eleAll("span[name=item-subtotal]");
    subtotalItemArray.forEach(item =>{
        let price = Number(item.textContent.replace("NT. ",""));
        newTotalPrice += price;
    })

    UpdatePriceTotalItemInfo(newTotalPrice ,subtotalItemArray.length);
    
}

function UpdatePriceTotalItemInfo(subtotal, product_counts){

    // Update Global Variable
    App.cart.order.subtotal = subtotal;
    App.cart.order.total = subtotal + App.cart.order.freight;

    // Update HTML Element
    lib.ele("#price_total").textContent = `${subtotal}`;
    lib.ele("#price_freight").textContent = App.cart.order.freight;
    lib.ele("#price_final").textContent = `${subtotal + App.cart.order.freight}`;
    lib.ele("#cart_title").textContent = `購物車(${product_counts})`;

}

function CreateCartEmptyDisplay(){
    // Update HTML
    lib.ele("#cart_item_block").innerHTML = "<span class='cart-empty'> Oh! 購物車空空的 :( </span>";
    lib.ele("#cart_item_block").style.cssText = "min-height: 50px;";
    //Update Global Variable
    App.CartReady = false;
}

function ConfirmPayment(){

    // Step1. Set up the info
    App.cart.order.list.map(item => {
        delete item["main_image"]; 
        delete item["stock"]; 
    });

    // Step2. Call Check Out API
    App.API.Body = JSON.stringify(App.cart);
    EstablishAPIConnection("checkout");
}

function ReceiveCheckoutResult(data){

    // Remove localStorage Data and Reset Global Variable
    RemoveLocalStorage("cart");
    App.cart.prime = "";
    App.cart.order.subtotal = 0;
    App.cart.order.total = 0;
    App.cart.order.list = [];
    ResetMultipleObject(App.cart.order.recipient);

    // Reset the cart icon 
    GetShoppingCartList();

    //Redierct Thank You Page
    RedirectPage("thanks" ,data.data.number);
}

// ----------------------------------------------
//  TapPay Functions
// ----------------------------------------------
function SetTapPayConfing(){
    // Set TapPay Config
    TPDirect.setupSDK(Config.TapPay.APP_ID, Config.TapPay.APP_KEY, Config.TapPay.ServerType);
    // Set Element Style
    let config = {
        fields: {
            number: {
                // css selector
                element: '#card-number',
                placeholder: '**** **** **** ****'
            },
            expirationDate: {
                // DOM object
                element: lib.ele('#card-expiration-date'),
                placeholder: 'MM / YY'
            },
            ccv: {
                element: '#card-ccv',
                placeholder: 'CCV'
            }
        },
        styles: {
            // Style all elements
            'input': {
                'color' : '#000'
            },
            // style invalid state
            '.invalid': {
                'color': 'red'
            }
        }
    };
    TPDirect.card.setup(config);

    //Detect Info
    TPDirect.card.onUpdate(update => CheckCreditCardResult(update));

}

function CheckCreditCardResult(update){

    let card_src = "style/images/credit/";
    let crad_type = "default.png";

    // Step1. Check Prime
    if (update.canGetPrime) {
        App.TabPayReady = true; 
    }
    else {
        App.cart.prime =  "";
        App.TabPayReady = false; 
    }

    // Baseon credit type set image 
    switch(update.cardType){
        case "visa":
        case "mastercard":
        case "jcb":
        case "amex":
            {
                crad_type = `${update.cardType}.png`;
            }
            break;
        default:
            {
                crad_type = "default.png"
            }
            break;
    }
    lib.ele("#credit_img").style.backgroundImage = `url('${card_src + crad_type}')`;
    
}

// ----------------------------------------------
//  Other Functions
// ----------------------------------------------
function InputEffects(id){
    let ele = lib.ele(`#${id}`);
    let event = window.event;
    switch(id){
        case "phone_number":
            {
                if(ele.value.length === 10 && event.keyCode !== 8){
                    lib.ele(`#receive_address`).focus();
                }
            }
            break;
        default:
            {
                console.log(`[cart.js] InputEffects function not defined this case. ${id}`);
            }
            break;
    }
    
}

function CheckKeyCodeNumber(){
    let e = window.event;
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 8) || (e.keyCode == 108)) { 
        //continue
    }
    else{
        event.preventDefault();
    }
}

function CheckSubmitStatus(){

    let ErrorMsg = "";
    //Step1. Check Cart 
    if(App.CartReady){

        //Step2. Check Receive
        let ReceiveErrorMsg = CheckandSaveReceiveInfo();
        if(App.ReceiveReady)
        {

            //Step3. Check Payment Info
            if(App.TabPayReady){

                //Step4. Get Prime Key
                const tappayStatus = TPDirect.card.getTappayFieldsStatus();
                if (tappayStatus.canGetPrime === true) { 
                    //Get Prime and Set to Global Variable
                    TPDirect.card.getPrime((result) => {
                        if (result.status === 0) {
                            App.cart.prime =  result.card.prime;
                            ConfirmPayment();
                        }
                        else{
                            console.log(`[cart.js] Get prime error. ${result.msg}`);
                        }

                    });
                }
                else{
                    ErrorMsg = "請確認「付款資訊」是否填寫與正確";
                }               
            }
            else{
                ErrorMsg = "請確認「付款資訊」是否填寫與正確";
            }
        }
        else
        {
            ErrorMsg = ReceiveErrorMsg;
        }
    }
    else{
        ErrorMsg = "請確認「購物車內是否有商品」";
    }

    if(ErrorMsg !== ""){
        //Display Message
        let message = {
            type : "alert",
            text : [ErrorMsg.replace(/\r\n/g, "<br/>")],
            dofunction : `CloseMessageBox();`,
            autoclose : false
        };
        lib.CreateMessage(message);
    }
    else{
         //Display Message
         let message = {
            type : "create_order",
            text : ["建立訂單中..."],
            dofunction : `CloseMessageBox();`,
            autoclose : false
        };
        lib.CreateMessage(message);
    }
}

function CheckandSaveReceiveInfo(){

    let ErrorField = "";
    let receive_name = lib.ele("#receive_name");
    if(lib.CheckElementsValue(receive_name ,"empty") === false){
        ErrorField += "- 請填寫「收件人姓名」\r\n";
    }

    let receive_mail = lib.ele("#receive_mail");
    if(lib.CheckElementsValue(receive_mail, "empty") === false){
        ErrorField += "- 請填寫「Email」\r\n";
    }

    if(receive_mail.value !== "" && lib.CheckElementsValue(receive_mail, "email") === false){
        ErrorField += "- 請確認「Email」格式是否正確 \r\n";
    }

    let phone_number = lib.ele("#phone_number");
    if(lib.CheckElementsValue(phone_number ,"empty") === false){
        ErrorField += "- 請填寫「手機號碼」\r\n";
    }

    let receive_address = lib.ele("#receive_address");
    if(lib.CheckElementsValue(receive_address ,"empty") === false){
        ErrorField += "- 請填寫「收件地址」\r\n";
    }

    if(ErrorField !== ""){
        App.ReceiveReady = false;
        return ("請確認下列填寫的欄位與內容 : \r\n" + ErrorField);
    }
    else{
        // Update Global Variable
        App.ReceiveReady = true;
        App.cart.order.recipient.name = receive_name.value;
        App.cart.order.recipient.email = receive_mail.value;
        App.cart.order.recipient.phone = phone_number.value;
        App.cart.order.recipient.address = receive_address.value;
        App.cart.order.recipient.time = lib.ele("input[name='receiving-time']:checked").value;
        return "";
    }
}


// ----------------------------------------------
//  Event Listener
// ----------------------------------------------
window.addEventListener("load",() => {

    //Step1. Update Shopping Cart Icon
    GetShoppingCartList();

    //Step2. Get localStorage Data and Create Item
    CreateCartItem();

    //Step3. Setup TapPay Configuration
    window.setTimeout(SetTapPayConfing,10);

    //Step4. Init FB Setting and Set Variable
    const InitFB = async () => {
        await InitFBSetting();
        await CheckLoginState();
    }
    InitFB();  

});
