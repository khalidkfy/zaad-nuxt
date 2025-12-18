<script setup lang="ts">

const { aboutPage, getAboutPage, getPage1 } = usePages();
await getPage1();
await getAboutPage();
</script>
<template>
    <section class=" mt-3" aria-label="about us">
        <div class="about-us-banner">
            <div class="container">
                <div class="page-banner">
                    <div class="wrapper">
                        <div class="">
                            <h1>حيث يلتقي الشغف بالهدف </h1>
                            <p>حيث يجتمع الناس، ويجدون مجتمعًا، وينمون من خلال تجارة هادفة.</p>
                        </div>
                        <div class="img">
                            <NuxtImg width="627" height="370" src="/assets/images/about.svg" alt="about us"
                                title="about" />

                        </div>
                    </div>


                </div>
            </div>
        </div>

    </section>
    <section>
        <div class="content">
            <div class="container">
                <div v-html="aboutPage?.resource?.html"></div>
                <div class="mt-4">
                    <div class="row">
                        <div class="col-md-8">
                            <NuxtImg class="img-fluid w-100" width="804" height="474" src="/assets/images/about1.svg"
                                alt="about us" title="about" />
                        </div>
                        <div class="col-md-4">
                            <div class="row h-100 gap-2">
                                <div class="col-md-12">
                                    <NuxtImg class=" h-100" width="385" height="144" src="/assets/images/about2.svg"
                                        alt="about us" title="about" />
                                </div>
                                <div class="col-md-12">
                                    <NuxtImg class="h-100" width="385" height="310" src="/assets/images/about3.svg"
                                        alt="about us" title`="about" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="mt-5 pt-5">
        <div class="zaad-by-numbers">
            <div class="container">
                <h2>زاد بواسطة الارقام</h2>
                <div class="row align-items-center mt-4">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <div class="number-card">
                                    <div class="value">+2000</div>
                                    <div class="text">مشترون نشطون حول العالم</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-4">
                                <div class="number-card">
                                    <div class="value">+2000</div>
                                    <div class="text">مشترون نشطون حول العالم</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="number-card">
                                    <div class="value">+2000</div>
                                    <div class="text">مشترون نشطون حول العالم</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="number-card">
                                    <div class="value">+2000</div>
                                    <div class="text">مشترون نشطون حول العالم</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 d-flex justify-content-end">
                        <NuxtImg class="img-fluid w-100 h-100" src="/assets/images/about-numbers.svg" alt="about us"
                            title="about" />
                    </div>
                </div>
            </div>
        </div>
    </section>
    <LazyHomeActiveStores page="about" />
    <section class="mt-5 pt-5">
        <div class="container">
            <div class="blogs">
                <h3>
                    احدث مدونتنا</h3>
                <div class="row mt-3">
                    <div v-for="i in 4" class="col-md-3">
                        <BlogCard />
                    </div>

                </div>
            </div>
        </div>
    </section>
    <LazyHomeFeatures />
    <LazyHomePromotionsSection />
      <div class="accordion faqs mt-5" id="accordionFaqs">
                    <div class="accordion-item">
                        <h3 class="accordion-header" id="flush-headingOne-1">
                            <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseOne-accordionFaqs" aria-expanded="false"
                                aria-controls="flush-collapseOne-accordionFaqs">
                                عنوان السؤال
                            </button>
                        </h3>
                        <div id="flush-collapseOne-accordionFaqs" data-bs-parent="#accordionFaqs"
                            class="accordion-collapse collapse" aria-labelledby="flush-headingOne-1">
                            <div class="accordion-body muted-color">
                                اكتشف كل ما تحتاج معرفته في مكان واحد، مع إجابات واضحة وشاملة تجعل تجربتك أسهل وأكثر
                                ثقة.
                            </div>
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
                            <div class="accordion-body muted-color">
                                اكتشف كل ما تحتاج معرفته في مكان واحد، مع إجابات واضحة وشاملة تجعل تجربتك أسهل وأكثر
                                ثقة.
                            </div>
                        </div>
                    </div>
                </div>

</template>
<style scoped lang="scss">
.about-us-banner {
    background-color: #FF6A2A;

    .page-banner {
        width: 100%;

        @media (max-width:992px) {
            padding: 20px;
        }

        .wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;


            @media (max-width:992px) {
                justify-content: center;
            }

        }

        h1 {
            color: #FFFFFF;
            font-size: 40px;
            font-weight: 700;
        }

        p {
            color: #fff;
            font-size: 18px;
        }

        .img {
            transform: translateY(50px);

            @media (max-width:992px) {
                display: none;
            }
        }
    }

}

.content {
    margin-top: 90px;

    img {
        object-fit: cover;
    }

    @media (max-width:992px) {
        margin-top: 20px;
    }

}

.zaad-by-numbers {
    background-color: #FAFAFA;
    padding: 40px;

    h2 {
        color: #4A4A4A;
        font-size: 32px;
        font-weight: 600;
    }

    .number-card {
        background-color: #FFFFFF;
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        gap: 3px;

        .value {
            color: #4A4A4A;
            font-size: 32px;
            font-weight: 600;
            direction: ltr;
        }

        .text {
            font-weight: 400;
        }
    }
}
</style>