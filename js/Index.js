/* This JavaScript is only for index.html */

// ----------------------------------------------
//  Main Functions
// ----------------------------------------------
//Create Marketing Campaigns Block
function CreateMarketingCampaigns(resdata) {

    let ElementPara = [];

    if (resdata.data.length > 0) {

        let Index = 0;
        let DotChildItem = [];
        resdata.data.forEach(item => {

            //Create Image
            let ImgObj = 
            {
                type : "div",
                attr :[
                        {key : "class",value : "introduction-img"},
                        {key : "class",value : "pointer"},
                        {key : "onClick" ,value : `RedirectPage('detail' ,${item.product_id})`},
                        {key : "style",value : `background-image:url('https://${Config.HostName}${item.picture}')`}
                    ]
            };

            ElementPara.push(ImgObj);

            //Create TextBlock
            let TextObjItem = [];


            // Create TextContent
            let TextArray = item.story.split("\r\n"); 
            let LastTextItem = TextArray.pop();

            let TextTitle ={
                type : "span",
                attr :[{key : "class",value : "title"}],
                content : TextArray.map(item => item+"<br/>")
            };

            let TextDesc ={
                type : "span",
                attr :[{key : "class",value : "desc"}],
                content : [LastTextItem]
            };

            TextObjItem.push(TextTitle);
            TextObjItem.push(TextDesc);


            let TextObj =
            {
                type : "div",
                attr :[{key : "class",value : "introduction-box"},{key : "onClick" ,value : `RedirectPage('detail' ,${item.product_id})`}],
                child : TextObjItem
            };

            ElementPara.push(TextObj);

            let DotItem ={
                type : "div",
                attr :[
                    {key : "class",value : "dot"},
                    {key : "onClick",value : `StopAndRecallNextIntroduction(${Index})`}]
            };

            DotChildItem.push(DotItem);

            Index++;
        });

        let BlockDot = {}
        let DotAttr =[];
        BlockDot.type = "div";
        DotAttr.push({key:"class",value:"introduction-dot"});
        BlockDot.attr = DotAttr;
        BlockDot.child = DotChildItem;

        ElementPara.push(BlockDot);

        // Create Element
        lib.CreateElemnt(ElementPara ,obj.Introduction);

        AllIntroductionImg = lib.eleAll(".introduction-img");
        AllIntroductionBox = lib.eleAll(".introduction-box");
        AllIntroductionDot = lib.eleAll(".dot");

        AllIntroductionDot[0].classList.add("current"); //Default
        IntroductionInterval = window.setInterval(NextIntroduction, 10000); //Every 10 sec change photo

    }
    else {
        //Pass
    }

}

//Create Product List
function CreateProductElement(resdata) {

    let ElementPara = [];

    if (resdata.data !== null && resdata.data.length > 0) 
    {

        resdata.data.forEach(item => {
        
            //Create a product outer
            let ProductOuter = {};
            let OuterAttrArray = [];
            let ProductOuterChild = [];
            ProductOuter.type = "div";
            OuterAttrArray.push({key : "class",value : "product-item"});
            OuterAttrArray.push({key : "onClick",value : `RedirectPage('detail' ,${item.id})`});
            ProductOuter.attr = OuterAttrArray;
            ProductOuter.child = ProductOuterChild;
            
            //Create product image
            let ProductImg = {};
            let ImgAttrArray = [];
            ProductImg.type = "IMG";
            ImgAttrArray.push({key : "alt",value : "product-img"});
            ImgAttrArray.push({key : "src",value : item.main_image});
            ImgAttrArray.push({key : "class",value : "product-img"});
            ProductImg.attr = ImgAttrArray;

            ProductOuterChild.push(ProductImg);

            //Create product color
            let ProductColor = {};
            let ColorAttrArray = [];
            let ColorBlockChild = [];
            ProductColor.type = "div";
            ColorAttrArray.push({key : "class",value : "product-color"});
            ProductColor.attr = ColorAttrArray;
            ProductColor.child = ColorBlockChild;

            item.colors.forEach(color => {

                let ProductColorItem = {};
                let ItemAttrArray = [];
                ProductColorItem.type = "div";
                ItemAttrArray.push({key : "class",value : "color-block"});
                ItemAttrArray.push({key : "style",value : "background-color:#" + color.code});
                ItemAttrArray.push({key : "title",value : color.name});
                ProductColorItem.attr = ItemAttrArray;

                ColorBlockChild.push(ProductColorItem);
            });

            ProductOuterChild.push(ProductColor);

            //Create product name
            let ProductName = {};
            let NameAttrArray = [];
            ProductName.type = "div";
            NameAttrArray.push({key : "class",value : "product-name"});
            ProductName.attr = NameAttrArray;
            ProductName.content = [item.title];

            ProductOuterChild.push(ProductName);

            //Create product price
            let ProductPrice = {};
            let PriceAttrArray = [];
            ProductPrice.type = "div";
            PriceAttrArray.push({key : "class",value : "product-price"});
            ProductPrice.attr = PriceAttrArray;
            ProductPrice.content = ["TWD. " + item.price];

            ProductOuterChild.push(ProductPrice);

            ElementPara.push(ProductOuter);

        });

         // Create Element
         lib.CreateElemnt(ElementPara ,obj.ProductParentElement);

    }
    else {
        //Create a product outer
        let Message = {};
        Message.type = "span";
        Message.content = ["Sorry! 我們沒有相關的產品 : ("];

        ElementPara.push(Message);

        lib.CreateElemnt(ElementPara ,obj.ProductParentElement);
    }

    if (resdata.paging !== undefined) {
        //have next page
        App.Paging = resdata.paging;
        window.addEventListener("scroll", HandleScrollEvent);
    }
    else {
        App.Paging = 0;
    }

    EnableSubmitButton();

}

// Slide Effect Function
function NextIntroduction(NewIndex)
{
    //Move out current image
    AllIntroductionImg[App.IntroductionIndex].classList.add("out"); 
    AllIntroductionImg[App.IntroductionIndex].classList.remove("in");
    AllIntroductionBox[App.IntroductionIndex].classList.add("box-out"); 
    AllIntroductionBox[App.IntroductionIndex].classList.remove("box-in");  
    AllIntroductionDot[App.IntroductionIndex].classList.remove("current");
    
    if(NewIndex !== undefined){
        App.IntroductionIndex = NewIndex;
    }
    else{
        //利用取餘數的方式無限循環
        App.IntroductionIndex = (App.IntroductionIndex + 1) % AllIntroductionImg.length; 
    }
    
    //Move in current image
    AllIntroductionImg[App.IntroductionIndex].classList.add("in");
    AllIntroductionImg[App.IntroductionIndex].classList.remove("out"); 
    AllIntroductionBox[App.IntroductionIndex].classList.add("box-in"); 
    AllIntroductionBox[App.IntroductionIndex].classList.remove("box-out");  
    AllIntroductionDot[App.IntroductionIndex].classList.add("current");

}

// User Click the Change Image Button
function StopAndRecallNextIntroduction(Index){
    clearInterval(IntroductionInterval);
    NextIntroduction(Index);
    IntroductionInterval = window.setInterval( NextIntroduction ,10000 ); 
}


// ----------------------------------------------
//  Event Listener
// ----------------------------------------------
window.addEventListener("load",() => {

    //Step1. Call API to get marketing campaign
    CallAPI(CreateMarketingCampaigns);

    //Step2. Get URL Para
    let category = GetURLParamenter("category");
    let search = GetURLParamenter("search");

    //Step3. Check value
    if(category !== null && category.trim() !== "" ){
        EstablishAPIConnection(category ,null);
    }
    else if(search !== null && search.trim() !== "" ){
        EstablishAPIConnection("search" ,search);
    }
    else{
        EstablishAPIConnection("all" ,null);
    }

    //Step4. Update Shopping Cart
    GetShoppingCartList();

    //Step5. Init FB Setting 
    InitFBSetting();

});
