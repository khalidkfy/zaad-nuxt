<template>
    <section class="mt-5">
        <div class="container">
            <div class="faq-banner">
                <div class="text-center">
                    <p class="title">{{ $t("links.faq") }}</p>
                    <h1>اكتشف ردود عن اسالتك جميعها</h1>
                    <p class="p">اكتشف الإنجازات التي تميزنا. من المشاريع الرائدة إلى الجوائز المرموقة في الصناعة، نفخر
                        بإنجازاتنا
                    </p>
                </div>
                <!-- search -->
                <div class="row">
                    <div class="col-md-4 mx-auto mt-4">
                        <div class="input-group">
                            <input type="text" class="form-control" id="phone" :placeholder="$t('faq.search')">
                            <div class="input-group-text">
                                <NuxtImg width="16" height="16" src="/assets/images/search.svg" />
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <section class="mt-5">
        <div class="container">
            <div class="accordion faqs mt-5" id="accordionFaqs">
                <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingOne-1">
                        <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne-accordionFaqs" aria-expanded="false"
                            aria-controls="flush-collapseOne-accordionFaqs">
                            ماذا في حال التسبّب بأي ضرر لزاد عُمان بسبب خرقي لأحد القوانين ضمن هذه الاتّفاقيّة؟
                        </button>
                    </h3>
                    <div id="flush-collapseOne-accordionFaqs" data-bs-parent="#accordionFaqs"
                        class="accordion-collapse collapse" aria-labelledby="flush-headingOne-1">
                        <div class="accordion-body ">منذ عام 2025، يعمل زاد التجاري على بناء جسور تربط بين البائعين
                            والمشترين الذين يجمعهم الشغف والقيم المشتركة. في زاد، يجد الناس المكان الأمثل لشراء وبيع
                            المنتجات التي تلبّي احتياجاتهم، وتُثري مجموعاتهم، وتضيف لمسة من السعادة إلى حياتهم — سواء
                            كانت منتجات حديثة تواكب العصر أو قطع مميزة من الماضي.</div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h3 class="accordion-header" id="flush-headingOne-2">
                        <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne-accordionFaqs2" aria-expanded="false"
                            aria-controls="flush-collapseOne-accordionFaqs">
                            عنوان السؤال
                        </button>
                    </h3>
                    <div id="flush-collapseOne-accordionFaqs2" data-bs-parent="#accordionFaqs"
                        class="accordion-collapse collapse" aria-labelledby="flush-headingOne-2">
                        <div class="accordion-body">منذ عام 2025، يعمل زاد التجاري على بناء جسور تربط بين البائعين
                            والمشترين الذين يجمعهم الشغف والقيم المشتركة. في زاد، يجد الناس المكان الأمثل لشراء وبيع
                            المنتجات التي تلبّي احتياجاتهم، وتُثري مجموعاتهم، وتضيف لمسة من السعادة إلى حياتهم — سواء
                            كانت منتجات حديثة تواكب العصر أو قطع مميزة من الماضي.</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped lang="scss">
.faq-banner {
    padding: 40px;
    // background-color: #BCBCBC14;
    border-radius: 16px;
    background-image: url('/assets/images/faq.svg');

    h1 {
        font-size: 32px;
        font-weight: 700;
        color: #fff;
    }

    p.title {
        color: #fff;
        font-size: 14px;
    }

    p.p {
        color: #fff;
        margin-top: 25px;
        font-weight: 500;
        font-size: 14px;
    }

    .input-group {
        input {
            padding: 12px;
            border-radius: 8px;
            border-color: transparent;
            box-shadow: none;
            background: #FFFFFF80;
            backdrop-filter: blur(20.700000762939453px);
            color: #fff;

            &::placeholder {
                color: #fff;
            }


        }

        img {
            background-color: var(--main-color);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            padding: 7px;
            cursor: pointer;
        }

        .input-group-text {
            background: #FFFFFF80;
            backdrop-filter: blur(20.700000762939453px);
            border: none;
            border-radius: 8px;
        }
    }

}

.accordion.faqs .accordion-item {
    border: 0;
    border: 1px solid #C5C5C5;
    border-radius: 16px;
    margin-bottom: 20px;
}

.accordion.faqs .accordion-item .accordion-button {
    border-radius: 16px;
    font-size: 16px;
    font-weight: 700;
    color: #4A4A4A;

    &::after {
        background-image: url('/assets/images/faqcol.svg');
    }
}

.accordion-button:not(.collapsed)::after {
    background-image: url('/assets/images/faquncol.svg') !important;
}

.accordion.faqs .accordion-item .accordion-button:focus {
    box-shadow: none;
}

.accordion.faqs .accordion-item .accordion-button:not(.collapsed) {
    background-color: #fff;
}

.accordion.faqs .accordion-body {
    color: #7B7B7B;
    font-weight: 400;
}
</style>