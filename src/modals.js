"use strict";

let modals = (function () {
    let modalStack = [];

    let warning = {
        sure: "Are you sure you want to close this window?",
        yes: "Yes",
        no: "No"
    };

    document.addEventListener("click", ev => {
        if (ev.target.matches(".modalsjs-popupimage")){
            let imgSrc = ev.target.dataset.imgSrc || ev.target.src;
            openModalImage(imgSrc, ev.target.dataset.imgTitle, ev.target.dataset.imgDesc);
        }
    });

    let modalBackBlur = createElement("div", "modalsjs-backblur");
    modalBackBlur.addEventListener("click", closeModal);

    function openModal(html, options) {
        let modal = createElement("div", "modalsjs-modalview");
        modal.addEventListener("click", ev => {
            if (ev.target.matches(".modalsjs-closebutton"))
                closeModal();
        });
        if (!options || !options.hideClose)
            modal.appendChild(createElement("span", "modalsjs-closebutton", "\u2716"));
        modal.innerHTML += html;
        modalStack.push({
            type: "modal",
            element: modal,
            options
        });
        if (modalStack.length === 1)
            document.body.appendChild(modalBackBlur);
        document.body.appendChild(modal);
    }

    function openModalImage(src, title, desc) {
        let html = "<div><img src='" + src + "' alt=''>";
        if (title)
            html += "<b class='modalsjs-modalimage-title'>" + title + "</b>";
        if (desc)
            html += "<span class='modalsjs-modalimage-desc'>" + desc + "</span>";
        html += "</div>";

        let modal = createElement("div", "modalsjs-modalimage", html);
        modal.addEventListener("click", closeModal);
        modalStack.push({
            type: "modal",
            element: modal
        });
        if (modalStack.length === 1)
            document.body.appendChild(modalBackBlur);
        document.body.appendChild(modal);
    }

    function peekModal() {
        if (modalStack.length === 0)
            return undefined;
        return modalStack[modalStack.length - 1];
    }

    function createElement(tag, cls, cnt) {
        let element = document.createElement(tag);
        element.classList.add(cls);
        if (cnt) element.innerHTML = cnt;
        return element;
    }

    function warn(warningOptions) {
        let html = warningOptions.custom ||
            ("<b class='modalsjs-warning-text'>" + (warningOptions.sure || warning.sure) + "</b>" +
                "<button class='modalsjs-warning-yes'>" + (warningOptions.yes || warning.yes) + "</button>" +
                "<button class='modalsjs-warning-no'>" + (warningOptions.no || warning.no) + "</button>");
        let modal = createElement("div", "modalsjs-modalview", html);

        modal.addEventListener("click", (ev) => {
            if (ev.target.matches(".modalsjs-warning-yes")){
                document.body.removeChild(modal);
                modalStack.pop();
                closeModal(true);
            }
            else if (ev.target.matches(".modalsjs-warning-no")){
                document.body.removeChild(modal);
                modalStack.pop();
            }
        });

        modalStack.push({
            type: "warning",
            element: modal
        });
        document.body.appendChild(modal);
    }

    function closeModal(ignoreWarning) {
        let modal = peekModal();
        if (modal.type === "warning"){
            document.body.removeChild(modal.element);
            modalStack.pop();
            modal = peekModal();
        }

        if (ignoreWarning !== true && modal.options && modal.options.warning){
            warn(modal.options.warningOptions || warning);
        }
        else {
            if (modal.options && modal.options.onClose)
                modal.options.onClose();
            document.body.removeChild(modal.element);
            modalStack.pop();
            if (modalStack.length === 0)
                document.body.removeChild(modalBackBlur);
        }
    }

    function closeAllModals() {
        for (let i = 0; i < modalStack.length; i++){
            document.body.removeChild(modalStack[i].element);
        }
        document.body.removeChild(modalBackBlur);
        modalStack = [];
    }

    return {
        open: openModal,
        openImage: openModalImage,
        close: closeModal,
        closeAll: closeAllModals
    }
})();