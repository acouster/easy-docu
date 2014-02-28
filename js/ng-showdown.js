
angular.module('ng').directive('markdown', function() {
	var converter = new Showdown.converter();
	function replaceAll(find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	}
	return {
		restrict: 'EA',
		link: function (scope, element, attrs) {
			var htmlText = element.html();
			// TODO: &gt; is still rejected if written explicitly in broswer
			htmlText = replaceAll('&lt;', '<', htmlText);
			htmlText = replaceAll('&gt;', '>', htmlText);
			element.html(converter.makeHtml(htmlText));
			selected_languages = LANGUAGES;
			$.each(element.find('pre code'), function (i, x) {
				initHighlight(x);
			});
		}
	};
});


