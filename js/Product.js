/* This JavaScript is only for product.html */

// ----------------------------------------------
//  Main Functions
// ----------------------------------------------
function CreateProductDetailElement(resdata) {

    if (resdata.data !== null) {

        //Create Main Image
        let product_img_outer = lib.ele("#product_img");
        let product_img = [{
            type : "IMG",
            attr :[
                    {key : "alt",value : "product-main-img"},
                    {key : "src",value : resdata.data.main_image}]
        }];
        lib.CreateElemnt(product_img ,product_img_outer);

        //Create Title
        let product_title = lib.ele("#product_title");
        product_title.textContent = resdata.data.title;
        document.title = `Stylish - ${resdata.data.title}`;

        let product_id = lib.ele("#product_id");
        product_id.textContent = resdata.data.id;

        let product_price = lib.ele("#product_price");
        product_price.textContent = `TWD. ${resdata.data.price}`;

        //Create Product Color Item
        let product_color = new Array();
        let product_color_block = lib.ele("#product_color_block");
        let colorindex = 0;
        resdata.data.colors.forEach( item => {
            let product_color_item = {
                type : "div",attr :[
                    {key : "class",value : "color-item"},
                    {key : "style",value : `background-color: #${item.code}`},
                    {key : "title",value : item.name},
                    {key : "color",value : item.code},
                    {key : "onClick",value :`CheckSizeAndStock('${item.code}' ,'${item.name}' ,${colorindex})`}]
            };
            product_color.push(product_color_item);
            colorindex ++;
        });

        lib.CreateElemnt(product_color, product_color_block);

        //Create Product Size Array
        let product_size = new Array();
        let product_size_block = lib.ele("#product_size_block");
        let sizeindex = 0;
        resdata.data.sizes.forEach( item => {
            let product_size_item = {
                type : "div",
                attr :[
                    {key : "class",value : "size-item"},
                    {key : "onClick",value :`CheckStock('.product-size-block .size-item' ,${sizeindex})`}]
                ,content : [item]
            };
            product_size.push(product_size_item);
            sizeindex ++;
        });

        lib.CreateElemnt(product_size, product_size_block);

        // Product Details
        let product_desc = lib.ele("#product_desc");
            product_desc.textContent = `${resdata.data.note}\r\n\r\n\
                ${resdata.data.texture}\r\n\
                ${resdata.data.description}\r\n\r\n\
                清洗：${resdata.data.wash}\r\n\
                產地：${resdata.data.place}`;

        // Create Mode Desc
        let product_more_desc = lib.ele("#product_more_desc");
        product_more_desc.textContent = resdata.data.story;

        // More Image
        let product_detail_block = lib.ele("#product_detail_block");
        let product_more_pic =[{
            type : "IMG",
            attr :[{key : "class",value : "product-more-pic"},{key : "src" ,value : resdata.data.images[0]}],
        },
        {
            type : "IMG",
            attr :[{key : "class",value : "product-more-pic"},{key : "src" ,value : resdata.data.images[1]}],
        }];

        lib.CreateElemnt(product_more_pic ,product_detail_block);

        //Store the product stock to a global variable
        App.Prodcut.Stock = resdata.data.variants;

    }
    else{
        alert("Sorry, this item has been removed or does not exist. :( ");
        window.location = "index.html"; 
    }

    // Set Default Select Color and Size
    SetProductDetailsDefault();
}

function SetProductDetailsDefault(){
    let ColorArray = lib.eleAll(".product-color-block .color-item");
    let SelectedColor = ColorArray[0].getAttribute("color");
    let SelectedColorName = ColorArray[0].getAttribute("title");
    CheckSizeAndStock(SelectedColor ,SelectedColorName, 0);
}

// User Click the Color Item
// 1. Disable out of stock size buttons
// 2. Auto select first have stock size
// 3. Update Global Variable
// 4. Set Max Stock Value and Change Style
function CheckSizeAndStock(color, colorname, index){

    let HaveStockSizeArray = App.Prodcut.Stock.filter(item => item.color_code === color && item.stock !== 0);
    let size_item = lib.eleAll(".size-item");

    // Change Style
    ChangeSelectItemStyle(".product-color-block .color-item" ,index);

    size_item.forEach(size => {

        // Reset
        size.classList.remove("select");

        // Check and Set the Size Button State 
        let size_filter = HaveStockSizeArray.filter(x => x.size === size.innerText);
        if(size_filter.length > 0){
            size.disabled = false;
            size.classList.remove("disable");
        }else{
            size.disabled = true;
            size.classList.add("disable");
        }
    });

    // Default Select First Enable Size
    let all_size_disable = true;
    for(let i = 0;i < size_item.length; i++){
        if(size_item[i].disabled === false){
            //Change Style and Update Global Variable (Size)
            size_item[i].classList.add("select");
            App.Prodcut.SelectedSize = size_item[i].innerText;
            all_size_disable = false;
            break;
        }
    }

    // Update Global Variable (Color And Size)
    App.Prodcut.SelectedColor.color = color;
    App.Prodcut.SelectedColor.name = colorname;

    if(all_size_disable === true){
        App.Prodcut.SelectedSize = "";
    }

    GetProductMaxStock();
}

// User Click the Size Item
// 1. Reset Selected Size Style
// 2. Update the gloabl variable
// 3. Set Max Stock Value And Change Style
function CheckStock(getClassName ,Selectindex){

    ChangeSelectItemStyle(getClassName,Selectindex);

    // Update Global Variable (Size And Max Stock)
    App.Prodcut.SelectedSize = lib.ele(".size-item.select").innerText;
    GetProductMaxStock();

}

function ChangeSelectItemStyle(getClassName ,Selectindex){
    let ElementArray = lib.eleAll(`${getClassName}`);
    ElementArray.forEach(item => item.classList.remove("select"));
    ElementArray[Selectindex].classList.add("select");
}

//Get User Selected Product Max Stock
function GetProductMaxStock(){

    let SelectedProductMaxStock = App.Prodcut.Stock.filter(item => 
        (item.color_code === App.Prodcut.SelectedColor.color 
            && item.size === App.Prodcut.SelectedSize 
            && item.stock > 0));

    // Update Global Variable
    // Change Counts Block Style
    let CountsElement = lib.ele("#product_counts");
    let CountsParent = lib.ele("#product_counts_block");

    if(SelectedProductMaxStock.length > 0){

        App.Prodcut.SelectedCounts = 1;
        App.Prodcut.SelectedItemStockCount = SelectedProductMaxStock[0].stock;

        CountsElement.innerText = 1; // Default Value
        CountsParent.classList.remove("disable");
        
    }
    else{

        App.Prodcut.SelectedCounts = 0;
        App.Prodcut.SelectedItemStockCount = 0;

        CountsElement.innerText = 0;
        CountsParent.classList.add("disable");
    }
}

// User Click the Plus or Minus Button
function ChangeProductCounts(type){
    let Counts = lib.ele("#product_counts");
    if(type === "plus"){
        // Confirm whether the stock is over
            if(Counts.innerText < App.Prodcut.SelectedItemStockCount){
                Counts.innerText = Number(Counts.innerText) + 1;
            }
    }
    else{
        if(Counts.innerText > 1){
                Counts.innerText = Number(Counts.innerText) - 1;
        }
        else{
                Counts.innerText = 1;
        }
    }

    //Update Global Variable
    App.Prodcut.SelectedCounts = Number(Counts.innerText);
}

// Add to Shopping Cart 
//Step1. Check Color, Size, Counts is selected and valid
//Step2. Check update or insert
//Step3. Get All Information and Set to Object
function AddShoppingCart(){

    //Step1. Check Color, Size, Counts is selected and valid 
    if(isNullorUndefined(App.Prodcut.SelectedColor.color) !== true && isNullorUndefined(App.Prodcut.SelectedSize) !== true && App.Prodcut.SelectedCounts > 0){

        //Check is insert or update
        let localStorage_cart = GetLocalStorage("cart");
        
        if (localStorage_cart === null) {
            // Insert Cart
            App.cart.order.list.push(InsertProductItem());
            SetLocalStorage("cart", App.cart);
        } 
        else {

            //Update Cart
            let P_ID = lib.ele("#product_id").innerText;
            //Check is same product (id & color & size)
            let ExistPrductIndex = localStorage_cart.order.list.findIndex(item => 
                (item.id.trim() == P_ID.trim()
                && item.color.code.trim() == App.Prodcut.SelectedColor.color.trim()
                && item.size.trim() == App.Prodcut.SelectedSize.trim())
            );                
            if(ExistPrductIndex > -1){
                //Update Item
                localStorage_cart.order.list[ExistPrductIndex].qty = Number(App.Prodcut.SelectedCounts);
            }
            else{
                //Insert Item
                localStorage_cart.order.list.push(InsertProductItem());
            }

            // Insert or Update LocalStorage and Global Variable
            SetLocalStorage("cart", localStorage_cart);
            App.cart.order.list = localStorage_cart.order.list;
        }

        // Update Shopping Cart
        GetShoppingCartList();

        //Display Message
        let message = {
            type : "add_cart",
            text : ["商品已加入購物車"],
            dofunction : "CloseMessageBox()",
            autoclose : true,
            autoclosetime : 3000
        }
        lib.CreateMessage(message);

    }    
    else{
        alert("Please at leaset select one color, size and quantity.");
        console.log(`[product.js] Add product to shopping cart failed. color : ${App.Prodcut.SelectedColor.color} / size : ${App.Prodcut.SelectedSize} / counts : ${App.Prodcut.SelectedCounts} `);
    }

}

function InsertProductItem(){

    let P_ID = lib.ele("#product_id").innerText;
    let P_Name = lib.ele("#product_title").innerText;
    let P_Price = lib.ele("#product_price").innerText.replace("TWD. ","");
    let P_MainImg = lib.ele("#product_img").childNodes[3].getAttribute("src");

    return ({
        id : P_ID,
        name : P_Name,
        price : Number(P_Price),
        color : {
            name : App.Prodcut.SelectedColor.name,
            code : App.Prodcut.SelectedColor.color
        },
        size: App.Prodcut.SelectedSize,
        qty : Number(App.Prodcut.SelectedCounts),
        main_image : P_MainImg,
        stock : App.Prodcut.SelectedItemStockCount
    });
}


// ----------------------------------------------
//  Event Listener
// ----------------------------------------------
window.addEventListener("load",() => {

    //Step1. Get URL Para
    let id = GetURLParamenter("id");

    //Step2. Check value
    if(id !== null && isPostiveInteger(id)){
        //Step3. Call API to get product details
        //App.APIType = "products";
        EstablishAPIConnection("details" ,id);
    }
    else{
        //Alert Message and Redirect to Index.html
        alert("Oops! We found your product id is not invalid. Please try it again or check your product id is correct.");
        window.location = "index.html"; 
    }

    //Step3. Update Shopping Cart
    GetShoppingCartList();

    //Step4. Init FB Setting 
    InitFBSetting();

});
