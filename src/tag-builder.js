function tagBuilder(wrapperSelector, maxLevels) {
    this.maxLevels = maxLevels;
    this.wrapperSelector = wrapperSelector;
    this.wrapper = $(`${wrapperSelector}`);
    this.elements = $(wrapperSelector + " > a");

    const calculateTags = () => {
        let elementHeightCorrection = parseInt(elements.first().css('padding-top')) + parseInt(elements.first().css('padding-bottom') + parseInt(elements.first().css('border-width')));
        if(this.wrapper.height() /  (this.elements.height() + elementHeightCorrection) >= this.maxLevels + 1) {
            let offsetTop = 0;
            let counter = 0;
            let isAppended = false;
            let prevElement;
            this.elements.each(function () {
                let currentOffset = parseInt($(this).offset().top);
                if(currentOffset > offsetTop && counter < maxLevels + 2) {
                    offsetTop = currentOffset;
                    counter++;
                }
                if(counter > 1) {
                    if(!isAppended && $(window).width() > 767) {
                        prevElement.addClass('hidden-element');
                    }
                    $(this).addClass('hidden-element');
                    isAppended = true;
                }
                prevElement = $(this);
            })
            addShowMore();
            calculateElementsWidth();
        }
    }

    const addShowMore = () => {
        let showMore = $("<span>Показать еще</span>").addClass('show-more');
        this.wrapper.append(showMore);
        const wrapper = this.wrapper;
        showMore.on('click', function() {
            wrapper.find('.hidden-element').toggleClass("active");
            $(this).toggleClass('active');
            if($(this).hasClass('active')) {
                $(this).text('Скрыть');
            }else {
                $(this).text('Показать еще');
            }
        })
        this.showMore = showMore;
    }

    const calculateElementsWidth = () => {
        let tagsTotalWidth = 0;
        const gapValue = parseInt($('.tag-categories__wrapper').css('gap'));
        const wrapperWidth = this.wrapper.width();
        const totalElementWidth = parseInt(this.showMore.css('margin-left')) + parseInt(this.showMore.css('min-width'));
        $(`${this.wrapperSelector} > a:not(.hidden-element)`).each(function() {
            tagsTotalWidth += $(this).width() + parseInt($(this).css('padding-left')) * 2 + parseInt($(this).css('border-width')) * 2;
        })
        tagsTotalWidth += gapValue * ($('.tag-categories__wrapper > a:not(.hidden-element)').length)
        if(wrapperWidth - tagsTotalWidth < totalElementWidth) {
            $(`${this.wrapperSelector} > a:not(.hidden-element)`).last().addClass('hidden-element');
            calculateElementsWidth();
        }
    }
    calculateTags();
}