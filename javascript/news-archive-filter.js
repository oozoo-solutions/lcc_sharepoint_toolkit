	(function (global) {
	    "use strict";

	    var LCC = global.LCC || {};
	    LCC.Modules = LCC.Modules || {};
		LCC.Settings = LCC.Settings || {};

	    LCC.Modules.NewsArchiveFilter = function () {
	        this.start = function (element) {

				getArchiveMonths();
			
	            element.on('click', '.js-news-archive-filter-submit', function () {

	                var year = $(this).data('year');
	                var month = $(this).data('month');

	                var d = new Date(year, month, 0);
	                var start = year + "/" + month + "/1";
	                var end = year + "/" + month + "/" + d.getDate();

	                var queryString = "?startdate=" + start + "&enddate=" + end;
	                var newsUrl = ( LCC.Settings.NewsUrl !== undefined ) ? LCC.Settings.NewsUrl : "/Pages/NewsSearch.aspx";                   
                	window.location = newsUrl + queryString;


	            });	            

	            function getArchiveMonths() {
	                var source = $("#archive-template").html();
	                var template = Handlebars.compile(source);

					var today = new Date();
					var newsContentType = ( LCC.Settings.NewsContentType !== undefined ) ? LCC.Settings.NewsContentType : "News Article Page";
                    $.ajax({
	                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('pages')/items?$select=LCCMonthYear&$filter=NewsReleaseDate le '" + today.toISOString() + "' and OData__ModerationStatus eq 0 and ContentType eq '" + newsContentType + "'",
	                    type: "GET",
	                    dataType: 'json',
	                    headers: {
	                        "accept": "application/json;odata=verbose"
	                    },
	                    success: function (data) {

	                        var prevYear;
	                        var prevMonth;
	                        var years = [];
	                        var monthsString = ['None', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

							data.d['results'].sort(function (a, b) {
								return b.LCCMonthYear - a.LCCMonthYear;
							});
	                        $.each(data.d.results, function (index, item) {
								if (item.LCCMonthYear)
								{
									if (typeof prevMonth === 'undefined' || prevMonth != item.LCCMonthYear) {

										var itemYear = item.LCCMonthYear.substring(0, 4);
										var itemMonth = parseInt(item.LCCMonthYear.substring(4),10);
										var monthAsString = monthsString[itemMonth];

										if (typeof prevYear === 'undefined' || prevYear != itemYear) {
											years.push({ 'year': itemYear, 'months': [{ 'month': itemMonth, 'monthAsString': monthAsString }] });
											prevYear = itemYear;
										}
										else {
											years[years.length - 1].months.push({ 'month': itemMonth, 'monthAsString': monthAsString });
										}
										prevMonth = item.LCCMonthYear;
									}
								}
	                        });

	                        var html = template({ Years: years });
	                        $("#archive").html(html);

							LCC.modules.start($("#newsAccordion"));

	                    },
	                    error: function (err) {
	                        var html = "<p>Sorry, there is an error with this filter</p>";
	                        $("#archive").html(html);
	                    }
	                });
	            }			
				
	        }
	    };

	    global.LCC = LCC;
	})(window);