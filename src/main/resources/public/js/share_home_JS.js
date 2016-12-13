/*
	Handle load all blog posts 
*/

window.addEventListener('load', function(){
	var sectionTitle = document.getElementById('sub-share-content-title');
	var sectionContent = document.getElementById('sub-share-content-ul');

	var loadBlogxhrq = new XMLHttpRequest();
	var loadBlogURL = 'http://127.0.0.1:3000/loadAllBlogs';

	var allBlogHTML = '<p class="ripple-blog-poster">Post by User: {%BlogUser%}</p>' + 
					  '<p class="ripple-blog-content">{%BlogContent%}</p>' + 
					  '<p class="ripple-blog-date">On {%BlogPostDate%}</p>';
	sectionTitle.innerHTML = 'See what people are talking about';

	loadBlogxhrq.open('get', loadBlogURL, true);
	loadBlogxhrq.onreadystatechange = function(){
		if(loadBlogxhrq.readyState === XMLHttpRequest.DONE){
			var loadContentResponse = JSON.parse(loadBlogxhrq.responseText);
			for(var key in loadContentResponse){
				var curBlog = loadContentResponse[key];
				var newHTML = allBlogHTML;

				newHTML = newHTML.replace('{%BlogUser%}', curBlog['blog_id']);
				newHTML = newHTML.replace('{%BlogContent%}', curBlog['blog_content']);
				newHTML = newHTML.replace('{%BlogPostDate%}', curBlog['publish_date']);

				var newLi = document.createElement('li');
				newLi.setAttribute('class', 'ripple-all-blog-li');
				newLi.innerHTML = newHTML;

				sectionContent.appendChild(newLi);
			}
		}
	};
	loadBlogxhrq.send(null);
});

