"use strict";

let ModalsJs = (function () {
    let modalStack = [];
    const DEFAULT_WARNING = {
        title: "Are you sure you want to close this window?",
        accept: "Yes",
        reject: "No"
    };
    const CLASS = {
        BGC: "modalsjs-bgc",
        VIEW: "modalsjs-view",
        IMAGE: "modalsjs-image",
        CONTENT: "modalsjs-content",
        GALLERY: "modalsjs-gallery",
        SHADOW: "modalsjs-shadow",
        IMG_TITLE: "modalsjs-image-title",
        IMG_DESC: "modalsjs-image-desc",
        CLOSE_BTN: "modalsjs-closebutton",
        WARN_TEXT: "modalsjs-warning-text",
        WARN_YES: "modalsjs-warning-yes",
        WARN_NO: "modalsjs-warning-no",
    };

    let modalContainer = createElement("div", "modalsjs-container");
    let modalBackBlur = createElement("div", "modalsjs-backblur");
    modalBackBlur.addEventListener("click", () => close());
    modalContainer.appendChild(modalBackBlur);

    function initPopupImages(container, options) {
        let images = Array.from(container.getElementsByTagName("img"))
                        .filter(el => el.matches(".modalsjs-popupimage"));

        if (options && options.gallery){
            for (let i = 0; i < images.length; i++){
                images[i].addEventListener("click", ev => openGalleryImage(i, images));
            }
        }
        else {
            for (let i = 0; i < images.length; i++){
                images[i].addEventListener("click", ev =>
                    openImage(ev.target.dataset.imgSrc || ev.target.src, ev.target.dataset.imgTitle, ev.target.dataset.imgDesc));
            }
        }

    }

    function openGalleryImage(i, images) {
        let img = createElement("img", `${CLASS.IMAGE} ${CLASS.GALLERY} ${CLASS.SHADOW}`);
        img.tabIndex = 0;
        let caption = createElement("figcaption");
        let title = createElement("div", CLASS.IMG_TITLE);
        let desc = createElement("div", CLASS.IMG_DESC);
        let nav = createElement("div", "modalsjs-gallery-nav");
        let left = createElement("b", "modalsjs-gallery-left");
        let right = createElement("b", "modalsjs-gallery-right");
        let no = createElement("span");
        nav.appendChild(left);
        nav.appendChild(no);
        nav.appendChild(right);
        caption.appendChild(title);
        caption.appendChild(desc);

        const setImg = (newI) => {
            let image = images[newI];
            img.title = image.dataset.imgTitle || "";
            img.src = image.dataset.imgSrc || image.src;
            title.innerText = image.dataset.imgTitle || "";
            desc.innerText = image.dataset.imgDesc || "";
            no.innerText = `${newI+1}/${images.length}`;
        };

        setImg(i, images);

        let figure = createElement("figure", CLASS.VIEW);
        figure.appendChild(nav);
        figure.appendChild(img);
        figure.appendChild(caption);
        img.addEventListener("keydown", ev => {
            switch (ev.keyCode){
                case 37: modal.prev(); break;
                case 39: modal.next(); break;
                case 27: close(false, modal); break;
            }
        });
        let modal = { type: "modal", element: figure };
        modal.prev = () => { if (i > 0) setImg(--i, images) };
        modal.next = () => { if (i < images.length - 1) setImg(++i, images) };
        img.addEventListener("click", () => close(true, modal));
        left.addEventListener("click", modal.prev);
        right.addEventListener("click", modal.next);
        showModal(modal);
        img.focus();
        return modal;
    }

    function open(html, options) {
        let element = createElement("div", `${CLASS.VIEW} ${CLASS.SHADOW} ${CLASS.BGC}`);
        let modal = { type: "modal", element, options };

        if (!options || !options.hideClose){
            let closeBtn = createElement("div", CLASS.CLOSE_BTN, "\u2716");
            closeBtn.addEventListener("click", () => close(false, modal));
            closeBtn.style.position = "absolute";

            let closeBtnWrapper = createElement("div");
            closeBtnWrapper.style.position = "relative";
            closeBtnWrapper.style.float = "right";
            closeBtnWrapper.appendChild(closeBtn);
            element.appendChild(closeBtnWrapper);
        }
        let content = createElement("div", CLASS.CONTENT);
        content.innerHTML = html;
        element.appendChild(content);
        showModal(modal);
        if (!options || options.autofocus !== false){
            let focusTarget = element.querySelector("input,select,textarea");
            if (focusTarget) focusTarget.focus();
        }
        return modal;
    }

    function openImage(src, title, desc) {
        let html = `<img class="${CLASS.IMAGE} ${CLASS.SHADOW}" src='${src}' alt='${title || ""}'><figcaption>`;
        if (title)
            html += `<div class='${CLASS.IMG_TITLE}'>${title}</div>`;
        if (desc)
            html += `<small class='${CLASS.IMG_DESC}'>${desc}</small>`;
        html += "</figcaption>";

        let element = createElement("figure", CLASS.VIEW, html);
        let modal = { type: "modal", element };
        element.addEventListener("click", () => close(true, modal));
        showModal(modal);
        return modal;
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
        element.className = cls || "";
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

    function prompt(promptOptions) {
        return new Promise((res, rej) => {
            let html = promptOptions.custom ||
                (`<b class='${CLASS.WARN_TEXT}'>` + (promptOptions.title || DEFAULT_WARNING.title) + "</b>" +
                    `<button class='${CLASS.WARN_YES}'>` + (promptOptions.accept || DEFAULT_WARNING.accept) + "</button>" +
                    `<button class='${CLASS.WARN_NO}'>` + (promptOptions.reject || DEFAULT_WARNING.reject) + "</button>");
            let element = createElement("div", `${CLASS.VIEW} ${CLASS.SHADOW} ${CLASS.BGC}`, html);
            let warning = { type: "warning", element };
            element.addEventListener("click", (ev) => {
                if (ev.target.matches('.' + CLASS.WARN_YES)){
                    modalContainer.removeChild(element);
                    removeModalFromStack(warning);
                    res(true);
                }
                else if (ev.target.matches('.' + CLASS.WARN_NO)){
                    modalContainer.removeChild(element);
                    removeModalFromStack(warning);
                    res(false);
                }
            });
            modalStack.push(warning);
            modalContainer.appendChild(element);
        });

    }

    function onCloseWarning(warningOptions, modal) {
        prompt(warningOptions).then(answer => { if (answer) close(true, modal) });
    }

    function handleOptions(ignoreWarning, modal) {
        if (ignoreWarning !== true && modal.options && modal.options.warning){
            onCloseWarning(modal.options.warningOptions || DEFAULT_WARNING, modal);
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
        prompt,
        initPopupImages
    }
})();