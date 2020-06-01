// "use strict";

import tipData from "../data/dm_metaword.js";


export default class ShowMetaWord {
    constructor(opt) {
        const ops = {
            // 提示框挂载节点
            el: "",
            // 记录打开过的术语提示框
            termHis: []
        };
        this.ops = Object.assign({}, ops, opt);
    }
    /**
     * 获取实例（单例模式）
     */
    static getInstance() {
        if (!ShowMetaWord.instance) {
            ShowMetaWord.instance = new ShowMetaWord();
            return ShowMetaWord.instance
        }
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
        <button id="tipBack">返回</button></button>
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
            that.ops.termHis.pop();
            that.setContent(that.ops.termHis[that.ops.termHis.length - 1]["name"], true)
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
            if (!isBack) {
                this.ops.termHis.push(tip);
            }
            document.getElementById("termName").innerHTML = tip.name;
            document.getElementById("termDesc").innerHTML = tip.desc;
        } else {
            document.getElementById("termName").innerHTML = "";
            document.getElementById("termDesc").innerHTML = "";
        }

        let that = this;
        $("metaword").click(function (e) {
            const name = e.target.textContent;
            console.log(name);

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
            console.log(e);
            console.log(e.target.parentNode.textContent.replace(/\s+/g, ""));
            // console.log(e.target.textContent);
            // let keyContent = e.target.parentNode.textContent.replace(/\s+/g, "");
            let keyContent = e.currentTarget.getAttribute("name");
            thas.appendHtml(e, keyContent);
            thas.setContent(keyContent);
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