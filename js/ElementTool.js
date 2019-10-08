let lib = {};
// ----------------------------------------------
//  Query Elements
// ----------------------------------------------
lib.ele = (para) => {return document.querySelector(para);}

lib.eleAll = (para) => {return document.querySelectorAll(para);}

// ----------------------------------------------
//  Remove Elements
// ----------------------------------------------
lib.RemoveElement = (parentID) => {
    let Element = lib.ele("#" + parentID);
    while (Element.firstChild) {
        Element.removeChild(Element.firstChild);
    }
}

// ----------------------------------------------
//  Create Message Box
// ----------------------------------------------
lib.CreateMessage = (para) => {

   let ParentObj = lib.ele("#message_box");
   lib.RemoveElement("message_box");
   let ChildObj = [];
    switch(para.type){
        case "add_cart":
            {
                ChildObj = [
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "message-img"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "relative"}],
                        child:[{
                                    type:"IMG",
                                    attr : [
                                        {key : "src",value : "style/images/shopping_cart.png"},
                                        {key : "alt",value : "icon"}]
                                },
                                {
                                    type:"IMG",
                                    attr : [
                                        {key : "src",value : "style/images/icon_heart.png"},
                                        {key : "alt",value : "icon"},
                                        {key : "class",value :"icon-heart"},
                                        {key : "class",value :"absolute"}]
                                }],
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "message-content"},
                                {key : "class",value : "align-self-center"}],
                        child:[{
                                    type:"span",
                                    content: para.text
                                }]
                    },
                    {
                        type:"hr",
                        attr:[
                                {key : "class",value : "message-hr"},
                                {key : "class",value : "align-self-center"}]
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "btn"},
                                {key : "class",value : "bk-dark"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "pointer"},
                                {key : "class",value : "white"},
                                {key : "onclick",value : para.dofunction}],
                        content: ["確定"]
                    }
                ]
            }
            break;
        case "remove_item":
            {
                ChildObj = [
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "message-img"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "relative"}],
                        child:[{
                                    type:"IMG",
                                    attr : [
                                        {key : "src",value : "style/images/icon_trashcan.png"},
                                        {key : "alt",value : "icon"}]
                                },
                                {
                                    type:"IMG",
                                    attr : [
                                        {key : "src",value : "style/images/icon_trash.png"},
                                        {key : "alt",value : "icon"},
                                        {key : "class",value :"icon-trash"},
                                        {key : "class",value :"absolute"}]
                                }],
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "message-content"},
                                {key : "class",value : "align-self-center"}],
                        child:[{
                                    type:"span",
                                    content: para.text
                                }]
                    },
                    {
                        type:"hr",
                        attr:[
                                {key : "class",value : "message-hr"},
                                {key : "class",value : "align-self-center"}]
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "btn"},
                                {key : "class",value : "bk-dark"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "pointer"},
                                {key : "class",value : "white"},
                                {key : "onclick",value : para.dofunction}],
                        content: ["確定"]
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "btn"},
                                {key : "class",value : "btn-style2"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "pointer"},
                                {key : "onclick",value : para.dofunction_2}],
                        content: ["取消"]
                    }
                ]
            }
            break;
        case "alert":
            {
                ChildObj = [
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "message-img"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "relative"}],
                        child:[{
                                    type:"IMG",
                                    attr : [
                                        {key : "src",value : "style/images/icon_alert.png"},
                                        {key : "alt",value : "icon"}]
                                }],
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "message-content"},
                                {key : "class",value : "align-self-center"}],
                        child:[{
                                    type:"span",
                                    content: para.text
                                }]
                    },
                    {
                        type:"hr",
                        attr:[
                                {key : "class",value : "message-hr"},
                                {key : "class",value : "align-self-center"}]
                    },
                    {
                        type:"div",
                        attr:[
                                {key : "class",value : "btn"},
                                {key : "class",value : "bk-dark"},
                                {key : "class",value : "align-self-center"},
                                {key : "class",value : "pointer"},
                                {key : "class",value : "white"},
                                {key : "onclick",value : para.dofunction}],
                        content: ["確定"]
                    }
                ]
            }
            break;
        case "confrim":
                {
                    ChildObj = [
                        {
                            type:"div",
                            attr:[
                                    {key : "class",value : "message-img"},
                                    {key : "class",value : "align-self-center"},
                                    {key : "class",value : "relative"}],
                            child:[{
                                        type:"IMG",
                                        attr : [
                                            {key : "src",value : "style/images/icon_alert.png"},
                                            {key : "alt",value : "icon"}]
                                    }],
                        },
                        {
                            type:"div",
                            attr:[
                                    {key : "class",value : "message-content"},
                                    {key : "class",value : "align-self-center"}],
                            child:[{
                                        type:"span",
                                        content: para.text
                                    }]
                        },
                        {
                            type:"hr",
                            attr:[
                                    {key : "class",value : "message-hr"},
                                    {key : "class",value : "align-self-center"}]
                        },
                        {
                            type:"div",
                            attr:[
                                    {key : "class",value : "btn"},
                                    {key : "class",value : "bk-dark"},
                                    {key : "class",value : "align-self-center"},
                                    {key : "class",value : "pointer"},
                                    {key : "class",value : "white"},
                                    {key : "onclick",value : para.dofunction}],
                            content: ["確定"]
                        },
                        {
                            type:"div",
                            attr:[
                                    {key : "class",value : "btn"},
                                    {key : "class",value : "btn-style2"},
                                    {key : "class",value : "align-self-center"},
                                    {key : "class",value : "pointer"},
                                    {key : "onclick",value : para.dofunction_2}],
                            content: ["取消"]
                        }
                    ]
                }
                break;
        case "create_order":
                {
                    ChildObj = [
                        {
                            type:"div",
                            attr:[
                                    {key : "class",value : "message-img"},
                                    {key : "class",value : "align-self-center"},
                                    {key : "class",value : "relative"}],
                            child:[{
                                        type:"IMG",
                                        attr : [
                                            {key : "src",value : "style/images/icon_order.png"},
                                            {key : "alt",value : "icon"}]
                                    },
                                    {
                                        type:"IMG",
                                        attr : [
                                            {key : "src",value : "style/images/icon_ok.png"},
                                            {key : "alt",value : "icon"},
                                            {key : "class",value :"icon-ok"},
                                            {key : "class",value :"absolute"}]
                                    }],
                        },
                        {
                            type:"div",
                            attr:[
                                    {key : "class",value : "message-content"},
                                    {key : "class",value : "align-self-center"}],
                            child:[{
                                        type:"span",
                                        content: para.text
                                    }]
                        }
                    ]
                }
                break;
        default:
            {
                console.log("[ElementTool] not defined this type.");
            }
            break;
    }
    lib.CreateElemnt(ChildObj, ParentObj);

    // Diplay mask
    lib.ele("#mask").classList.remove("ishidden");

    // Display windows
    ParentObj.classList.remove("ishidden");

    if(para.autoclose){
        setTimeout(CloseMessageBox,para.autoclosetime)
    }
}


// ----------------------------------------------
//  Create Elements
// ----------------------------------------------
// Note : you can deliver a object like this
// 
/*

    let Obj = [
        {
            type:"div",
            attr:[
                {
                    key : "id",
                    value : "temp"
                },
                {
                    key : "style",
                    value : "color: red;"
                }],
            content:["some text"],
            child:
            [
                {
                    type:"IMG",
                    attr:[
                        {
                            key : "src",
                            value : "http://test.com"
                        }]
                }
            ]
        }
    ];
*/

lib.CreateElemnt = (ElementPara ,ParentObj) => {
    
    ElementPara.forEach(item => {

        //Step1. Create Element
        let ElementObj = document.createElement(item.type);

        //Step2. Set Element Attribute
        if(item.attr !== undefined ){
            item.attr.forEach(attr => lib.SetElementAttr(ElementObj ,attr.key ,attr.value));
        }

        //Step3. Set Content Text
        if(item.content !== undefined ){
            item.content.forEach(text => ElementObj.innerHTML += text);
        }

        //Step3. Create Child Element
        if(item.child !== undefined ){
            if(item.child.length > 0){
                lib.CreateElemnt(item.child ,ElementObj);
            }
        }
        
        //Step4. Append this element to parent element
        ParentObj.appendChild(ElementObj);

    });
}

lib.SetElementAttr = (obj ,type ,val) => {
    switch(type){
        case "class":
            {
                obj.classList.add(val);
            }
            break;
        case "style":
            {
                obj.style.cssText = val;
            }
            break;
        case "text":
            {
                obj.text = val;
            }
            break;
        default:
            {
                obj.setAttribute(type, val);
            }
            break;
    }
}

// ----------------------------------------------
//  Check Elements
// ----------------------------------------------
lib.CheckElementsValue = (obj ,type) => {

    let CheckResult = true; //Default Pass
    switch(type){
        case "empty":
            {
                if(obj.tagName === "INPUT"){
                    if(obj.value === ""){
                        CheckResult = false;
                    }
                }
            }
            break;
        case "email":
            {
                if(obj.tagName === "INPUT"){
                    let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/; 
                    if(pattern.test(obj.value)===false){
                        CheckResult = false;
                    } 
                }
            }
            break;
        default:
            {

            }
            break;
    }
    return CheckResult;
}