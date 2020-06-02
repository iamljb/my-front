// "use strict";

import tipData from "../data/dm_metaword.js";
import {createElement, render} from "../vdom/index.js"


export default class ShowMetaWord {
    constructor(opt) {
        const ops = {
            // 提示框挂载节点
            el: "",
            // 记录打开过的术语提示框
            termHis: [],
            currentIndex: 0
        };
        this.ops = Object.assign({}, ops, opt);
        console.log(tipData);
        console.log(createElement);
        console.log(render);

    }

    /**
     * 获取实例（单例模式）
     */
    static getInstance() {
        if (ShowMetaWord.instance) {
            return ShowMetaWord.instance;
        }
        ShowMetaWord.instance = new ShowMetaWord();
        return ShowMetaWord.instance;
    }

    /**
     * 创建提示框节点元素
     * @param {*} e
     * @param {*} keyContent
     */
    appendHtml(e, keyContent) {
        // let keyContent = e.target.textContent.replace(/\s+/g, "");
        let oEvent = e || event;
        let oDiv = document.createElement("div");
        oDiv.id = "carBox";

        let position = this.mousePosition(e);
        console.log(position);
        oDiv.style.left = position.x - 22 + "px"; // 指定创建的DIV在文档中距离左侧的位置
        oDiv.style.top = position.y + 20 + "px"; // 指定创建的DIV在文档中距离顶部的位置

        oDiv.style.border = "1px solid transparent"; // 设置边框
        oDiv.style.borderRadius = "5px";
        oDiv.style.background = "rgba(0,0,0,0.5)";
        oDiv.style.position = "absolute"; // 为新创建的DIV指定绝对定位
        oDiv.style.width = "300px"; // 指定宽度
        oDiv.style.height = "135px"; // 指定高度

        let content = `
		<div style="padding: 10px;color: #FFF;font-size: 10px;">
        <div style="width:100%;height:100px;overflow:auto;">
        <div style="float: left"><button id="tipBack">&#60;</button></button>
        <button id="tipGo">&#62;</button></button></div>
        <div style="float: right"><button id="closeBtn">x</button></div>
		<table style="float:top;width:100%;height:100%;">
        `;
        content += `<tr><td style="width:60px;">术语名称:</td><td id="termName"></td></tr>`;
        content += `<tr><td style="width:60px;">术语说明:</td><td id="termDesc"></td></tr>`;

        content += `
		</table>
		</div>
        `;

        let mDiv = document.getElementById("carBox");
        if (mDiv) {
            document.body.removeChild(mDiv);
        }

        oDiv.innerHTML = content;
        document.body.appendChild(oDiv);

        let that = this;
        $("#tipBack").click(function (e) {
            that.ops.currentIndex --;

            that.setContent(that.ops.termHis[that.ops.currentIndex]["name"], true)
            if (that.ops.currentIndex == 0) {
                // document.getElementById("tipBack").style.pointerEvents = "none";
                $('#tipBack').attr('disabled',"true")
            }else{
                $('#tipGo').removeAttr('disabled')

            }
        })

        $("#tipGo").click(function (e) {
            that.ops.currentIndex ++;
            that.setContent(that.ops.termHis[that.ops.currentIndex]["name"], true)
            if (that.ops.currentIndex == that.ops.termHis.length -1) {
                $('#tipGo').attr('disabled',"true")
                // document.getElementById("tipBack").style.cursor = "not-allowed";
            }else{
                $('#tipBack').removeAttr('disabled')

            }
        })

        $("#closeBtn").click(function (e) {
            $("#carBox").hide();
        })
    }

    /**
     * 设置提示框内容
     * @param {*} keyContent
     * @param {*} isBack
     */
    setContent(keyContent, isBack) {
        let tip = tipData.find(ele => ele.name == keyContent);
        if (tip) {
            if(!isBack){
                this.ops.termHis.push(tip);
            }
            document.getElementById("termName").innerHTML = tip.name;
            document.getElementById("termDesc").innerHTML = tip.desc;
        } else {
            document.getElementById("termName").innerHTML = "";
            document.getElementById("termDesc").innerHTML = "";
        }
        // $('#tipBack').removeAttr('disabled')
        // $('#tipGo').removeAttr('disabled')

        let that = this;
        $("metaword").click(function (e) {
            if (that.ops.currentIndex == 0) {
                // document.getElementById("tipBack").style.pointerEvents = "none";
                $('#tipBack').removeAttr('disabled')
            }

            const name = e.target.textContent;
            console.log(name);

            that.ops.currentIndex ++;
            that.setContent(name);
        })
    }

    /**
     *  获取鼠标位置
     * @param {*} ev
     */
    mousePosition(e) {
        var x, y;
        var e = e || window.event;
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        return {
            x: x,
            y: y
        };
    }

    init() {
        console.log("init");
        let thas = this;

        $(this.ops.el).click(function (e) {
            thas.ops.termHis = [];
            thas.ops.currentIndex = 0;
            console.log(e);
            console.log(e.target.parentNode.textContent.replace(/\s+/g, ""));
            // console.log(e.target.textContent);
            // let keyContent = e.target.parentNode.textContent.replace(/\s+/g, "");
            let keyContent = e.currentTarget.getAttribute("name");
            thas.appendHtml(e, keyContent);
            thas.setContent(keyContent);
            $('#tipBack').attr('disabled',"true")
            $('#tipGo').attr('disabled',"true")
        });
        // $(".metaWordClassName").mouseenter(function (e) {
        //     // console.log(e);
        //     // console.log(e.target.textContent);
        //     thas.appendHtml(e);
        // }).mouseleave(function () {
        //     let mDiv = document.getElementById("carBox");
        //     if (mDiv) {
        //         document.body.removeChild(mDiv);
        //     }
        // });

        // thas.appendCss();
        // thas.appendHtml();
        // thas.evnet();
        return thas;
    }

}
