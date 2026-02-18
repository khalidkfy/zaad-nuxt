<script setup lang="ts">
definePageMeta({
  prerender: true,
});
const { t, locale } = useI18n();

useSeo({
  title: t("meta.setMeta", { meta: t("links.faq") }),
  description: t("meta.setMeta", { meta: t("links.faq") }),
});

const questions = ref([]);
const getFaqs = async () => {
  try {
    const faqs = await $fetch("/api/faq/list", {
      headers: {
        Lang: locale.value,
      },
    });

    questions.value = groupByCategory(faqs?.data);
  } catch (err) {
    console.log(err);
  } finally {
  }
};

const groupByCategory = (items: any) => {
  return items.reduce((acc, item) => {
    const category = item.category_name;

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(item);

    return acc;
  }, {});
};

await getFaqs();
const search = ref("");
const filteredQuestions = computed(() => {
  if (!search.value) return questions.value;

  const term = search.value.toLowerCase();

  const result: any = {};

  Object.entries(questions.value).forEach(([category, faqs]) => {
    const filteredFaqs = (faqs as any[]).filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );

    if (filteredFaqs.length) {
      result[category] = filteredFaqs;
    }
  });

  return result;
});

const hasResults = computed(() => {
  return Object.keys(filteredQuestions.value).length > 0;
});
</script>
<template>
  <section class="mt-5">
    <div class="container">
      <div class="faq-banner">
        <div class="text-center">
          <p class="title">{{ $t("links.faq") }}</p>
          <h1>{{ $t("faq.h1") }}</h1>
          <p class="p">
           {{ $t("faq.p") }}
          </p>
        </div>
        <!-- search -->
        <div class="row">
          <div class="col-md-4 mx-auto mt-4">
            <div class="input-group">
              <input
                v-model="search"
                type="text"
                class="form-control"
                id="phone"
                :placeholder="$t('faq.search')"
              />
              <div class="input-group-text">
                <img
                  loading="lazy"
                  width="16"
                  height="16"
                  src="/assets/images/search.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="mt-5">
    <div class="container">
      <div v-if="hasResults" class="accordion faqs mt-5" id="accordionFaqs">
        <div
          v-for="(faqs, categoryName, categoryIndex) in filteredQuestions"
          :key="categoryIndex"
          class="faq-categ"
        >
          <h2 class="mb-4">{{ categoryName }}</h2>

          <!--FAQs is inside category -->
          <div v-for="(faq, faqIndex) in faqs" :key="faq.id" class="accordion-item">
            <h3 class="accordion-header">
              <button
                class="accordion-button collapsed fw-bold"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#faq-${faq.id}`"
                aria-expanded="false"
              >
                {{ faq.question }}
              </button>
            </h3>

            <div
              :id="`faq-${faq.id}`"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFaqs"
            >
              <div class="accordion-body">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <h4 class="mb-3">{{ $t("faq.noResults") }}</h4>
        <p class="text-muted">
          {{ $t("faq.tryDifferentKeyword") }}
        </p>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.faq-categ {
  h2 {
    color: var(--main-color);
  }
}
.faq-banner {
  padding: 40px;
  // background-color: #BCBCBC14;
  border-radius: 16px;
  background-image: url("/assets/images/faq.svg");

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
      background: #ffffff80;
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
      background: #ffffff80;
      backdrop-filter: blur(20.700000762939453px);
      border: none;
      border-radius: 8px;
    }
  }
}

.accordion.faqs .accordion-item {
  border: 0;
  border: 1px solid #c5c5c5;
  border-radius: 16px;
  margin-bottom: 20px;
}

.accordion.faqs .accordion-item .accordion-button {
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #4a4a4a;

  &::after {
    background-image: url("/assets/images/faqcol.svg");
  }
}

.accordion-button:not(.collapsed)::after {
  background-image: url("/assets/images/faquncol.svg") !important;
}

.accordion.faqs .accordion-item .accordion-button:focus {
  box-shadow: none;
}

.accordion.faqs .accordion-item .accordion-button:not(.collapsed) {
  background-color: #fff;
}

.accordion.faqs .accordion-body {
  color: #7b7b7b;
  font-weight: 400;
}
</style>
