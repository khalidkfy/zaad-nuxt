export const useBlog = () => {
  const { locale } = useI18n();

  const blogListRes = useState("blog-listRes", () => []);
  const blogList = useState("blog-listRes", () => []);
  const lastBlogPage = ref(0);
  const currentBlogPage = ref(0);
  const getBlogList = async () => {
    try {
      const data = await $fetch("/api/blog/list", {
        headers: {
          Lang: locale.value,
        },
      });
      blogListRes.value = data;
      blogList.value = data.resources;
      lastBlogPage.value = data.last_page;
      currentBlogPage.value = data.current_page;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const viewMore = async () => {
    if (currentBlogPage.value == lastBlogPage.value) return;
    const data = await $fetch("/api/blog/list", {
      headers: {
        Lang: locale.value,
      },
      query: {
        page: currentBlogPage.value + 1,
      },
    });

    if (data?.resources?.length) {
      lastBlogPage.value = data.last_page;
      currentBlogPage.value = data.current_page;
      data?.resources.forEach((blog: any) => {
        return blogList.value.push(blog);
      });
    }
  };

  const getBlog = async (blogId: any) => {
    try {
      const data = await $fetch(`/api/blog/show`, {
        headers: {
          Lang: locale.value,
        },
        query: {
          blogId,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return {
    blogList,
    getBlogList,
    viewMore,
    currentBlogPage,
    lastBlogPage,
    getBlog,
  };
};
