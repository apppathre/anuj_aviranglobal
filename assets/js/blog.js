async function loadBlogPosts() {
  const listContainer = document.getElementById('blog-list');
  const detailContainer = document.getElementById('blog-detail');
  const detailLayout = document.getElementById('blog-detail-layout');
  const sideListContainer = document.getElementById('blog-side-list');
  if (!listContainer || !detailContainer || !detailLayout || !sideListContainer) return;

  try {
    const response = await fetch('public/blogs.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load blog data');

    const data = await response.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!posts.length) {
      listContainer.innerHTML = '<article class="card"><h3>No blog posts yet</h3><p>Add posts in public/blogs.json.</p></article>';
      return;
    }

    if (slug) {
      const post = posts.find((item) => item.slug === slug);
      if (!post) {
        detailLayout.hidden = false;
        detailContainer.innerHTML = '<h2>Post Not Found</h2><p>The requested article was not found in blog data.</p><p><a class="btn btn-secondary" href="blog.html">Back to Blog List</a></p>';
        sideListContainer.innerHTML = '<h3>Other Articles</h3><p>No matching article found.</p>';
        return;
      }

      const paragraphs = Array.isArray(post.content)
        ? post.content.map((line) => `<p>${line}</p>`).join('')
        : '<p>No details available.</p>';

      const otherPosts = posts
        .filter((item) => item.slug !== slug)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      const sideLinks = otherPosts.length
        ? otherPosts
            .map(
              (item) => `
                <li>
                  <a href="blog.html?slug=${encodeURIComponent(item.slug)}">${item.title}</a>
                  <small>${item.category} | ${item.readTime}</small>
                </li>
              `
            )
            .join('')
        : '<li><span>No other posts available.</span></li>';

      detailLayout.hidden = false;
      detailContainer.innerHTML = `
        <img class="blog-image" src="${post.image}" alt="${post.title}" loading="lazy" />
        <p class="blog-meta">${post.category} | ${post.date} | ${post.readTime}</p>
        <h2>${post.title}</h2>
        <p>${post.summary}</p>
        ${paragraphs}
        <p><a class="btn btn-secondary" href="blog.html">Back to Blog List</a></p>
      `;

      sideListContainer.innerHTML = `
        <h3>Other Articles</h3>
        <ul>${sideLinks}</ul>
      `;

      listContainer.hidden = true;
      return;
    }

    const cards = posts
      .map(
        (post) => `
          <article class="card blog-card">
            <img class="blog-image" src="${post.image}" alt="${post.title}" loading="lazy" />
            <p class="blog-meta">${post.category} | ${post.date} | ${post.readTime}</p>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <p><a class="btn btn-secondary" href="blog.html?slug=${encodeURIComponent(post.slug)}">Read Article</a></p>
          </article>
        `
      )
      .join('');

    listContainer.innerHTML = cards;
    detailLayout.hidden = true;
  } catch (error) {
    listContainer.innerHTML = '<article class="card"><h3>Unable to Load Blog</h3><p>Please check public/blogs.json format and try again.</p></article>';
    detailLayout.hidden = true;
  }
}

loadBlogPosts();
