"use strict";

let ModalsJs = (function () {
    let modalStack = [];
    let _warning = {
        sure: "Are you sure you want to close this window?",
        yes: "Yes",
        no: "No"
    };

    let modalContainer = createElement("div", "modalsjs-container");
    let modalBackBlur = createElement("div", "modalsjs-backblur");
    modalBackBlur.addEventListener("click", close);
    modalContainer.appendChild(modalBackBlur);

    function initPopupImages(container, options) {
        let images = Array.from(container.getElementsByTagName("img"))
                        .filter(el => el.matches(".modalsjs-popupimage"));
        for (let i = 0; i < images.length; i++){
            images[i].addEventListener("click", ev => {
                let imgSrc = ev.target.dataset.imgSrc || ev.target.src;
                openImage(imgSrc, ev.target.dataset.imgTitle, ev.target.dataset.imgDesc);
            })
        }

    }

    function open(html, options) {
        let element = createElement("div", "modalsjs-view modalsjs-shadow modalsjs-bgc");
        let modal = { type: "modal", element, options };

        if (!options || !options.hideClose){
            let closeBtn = createElement("div", "modalsjs-closebutton", "\u2716");
            closeBtn.addEventListener("click", () => close(false, modal));
            element.appendChild(closeBtn);
        }
        let content = createElement("div", "modalsjs-content");
        content.innerHTML = html;
        element.appendChild(content);
        showModal(modal);
    }

    function openImage(src, title, desc) {
        let html = `<img class="modalsjs-image modalsjs-shadow" src='${src}' alt='${title || ""}'><figcaption>`;
        if (title)
            html += `<div class='modalsjs-image-title'>${title}</div>`;
        if (desc)
            html += `<small class='modalsjs-image-desc'>${desc}</small>`;
        html += "</figcaption>";

        let element = createElement("figure", "modalsjs-view", html);
        let modal = { type: "modal", element };
        element.addEventListener("click", () => close(true, modal));
        showModal(modal);
    }

    function showModal(modal) {
        modalStack.push(modal);
        if (modalStack.length === 1)
            document.body.appendChild(modalContainer);
        modalContainer.appendChild(modal.element);
    }

    function peekModal() {
        if (modalStack.length === 0)
            return undefined;
        return modalStack[modalStack.length - 1];
    }

    function createElement(tag, cls, html) {
        let element = document.createElement(tag);
        element.className = cls;
        if (html) element.innerHTML = html;
        return element;
    }

    function removeModalFromStack(modal) {
        for (let i = modalStack.length - 1; i >= 0; i--) {
            if (modalStack[i] === modal){
                modalStack.splice(i, 1);
                return;
            }
        }
    }

    function warn(warningOptions, modal) {
        let html = warningOptions.custom ||
               ("<b class='modalsjs-warning-text'>" + (warningOptions.sure || _warning.sure) + "</b>" +
                "<button class='modalsjs-warning-yes'>" + (warningOptions.yes || _warning.yes) + "</button>" +
                "<button class='modalsjs-warning-no'>" + (warningOptions.no || _warning.no) + "</button>");
        let element = createElement("div", "modalsjs-view modalsjs-shadow modalsjs-bgc", html);
        let warning = { type: "warning", element };
        element.addEventListener("click", (ev) => {
            if (ev.target.matches(".modalsjs-warning-yes")){
                modalContainer.removeChild(element);
                removeModalFromStack(warning);
                close(true, modal);
            }
            else if (ev.target.matches(".modalsjs-warning-no")){
                modalContainer.removeChild(element);
                removeModalFromStack(warning);
            }
        });
        modalStack.push(warning);
        modalContainer.appendChild(element);
    }

    function handleOptions(ignoreWarning, modal) {
        if (ignoreWarning !== true && modal.options && modal.options.warning){
            warn(modal.options.warningOptions || _warning, modal);
            return false;
        }
        if (modal.options && modal.options.onClose)
            modal.options.onClose();
        return true;
    }

    function close(ignoreWarning, modal) {
        let warning = peekModal();
        if (warning.type === "warning"){
            modalContainer.removeChild(warning.element);
            modalStack.pop();
        }
        modal = modal || peekModal();
        if (handleOptions(ignoreWarning, modal)){
            modalContainer.removeChild(modal.element);
            removeModalFromStack(modal);
            if (modalStack.length === 0)
                document.body.removeChild(modalContainer);
        }
    }

    function closeAll() {
        for (let i = 0; i < modalStack.length; i++)
            modalContainer.removeChild(modalStack[i].element);
        document.body.removeChild(modalContainer);
        modalStack = [];
    }

    return {
        open,
        openImage,
        close,
        closeAll,
        initPopupImages
    }
})();