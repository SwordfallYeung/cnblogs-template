<script type="text/javascript">
"use strict";

(function (window, document, navigator) {

    var element = {
        body: document.body,
	    main: "main",
        forFlow: "forFlow",
        postTitle: "cb_post_title_url",
        postBody: "cnblogs_post_body",
        postCategory: "BlogPostCategory",
        postTagList: "EntryTag",
        toc: "table_of_content_warp",
        digg: "div_digg",
        sideBar: "sideBar",
    };

    function $id(id) {
        return $("#" + id);
    }

   function $class(id) {
        return $("." + id);
    }

   function showTurtle(){
     var turtleBar = [];
      turtleBar.push('<div id="gadgetSWF">');
      turtleBar.push('<embed type="application/x-shockwave-flash" src="https://files-cdn.cnblogs.com/files/swordfall/turtle.swf" width="140" height="140" id="flashID" name="flashID" bgcolor="#FFFFFF" quality="high" scale="noscale" salign="tl" flashvars="up_backgroundColor=FFFFFF" wmode="opaque" allowscriptaccess="always">');
     turtleBar.push('</div>');
     var turtleBarHtml = turtleBar.join('');
     
     $(element.body).append(turtleBarHtml)
   }

    function showFixedBarCore() {
        var fixedBar = [];
        fixedBar.push('<div class="fixed-bar-warp">');
        fixedBar.push('<div class="fixed-bar">');

        if ($id(element.postBody).length) {
            fixedBar.push('<a class="item toc" href="javascript:sf.toc.toggle();" title="目录"><i class="fa fa-hashtag"></i></a>');
            fixedBar.push('<a class="item comments" href="#comment_form_container" title="评论列表"><i class="fa fa-comments"></i></a>');
            fixedBar.push('<a class="item comment" href="#comment_form" title="写评论"><i class="fa fa-pencil"></i></a>');
        }

        fixedBar.push('<a class="item top" href="javascript:scroll(0,0);" title="返回顶部"><i class="fa fa-arrow-circle-up"></i></a>');
        fixedBar.push('</div>');
        fixedBar.push('</div>');

        var fixedBarHtml = fixedBar.join('');

        $(element.body).append(fixedBarHtml)
    }

    function moveDiggCore() {
        var $sideBar = $id(element.sideBar);
        if ($sideBar.find(element.digg).length) {
            return true;
        }

        var $digg = $id(element.digg);
        if ($digg.length) {
            $sideBar.append($digg);
            return true;
        }
    }

    function copyCategoryAndTagCore() {
        var categotyHtml = $id(element.postCategory).html();
        var entryTagListHtml = $id(element.postTagList).html();

        if (categotyHtml) {
            var html = "<div class='post-categoty-tags'>";
            html += "<div class='post-categoty'>";
            html += categotyHtml;
            html += "</div>";
            html += "<div class='post-tags'>";
            html += entryTagListHtml;
            html += "</div>";
            html += "</div>";
            $(html).insertBefore("#topics .postBody");
            return true;
        }
    }

    function getPostTitleCore() {
        return $id(element.postTitle).text();
    }

    function getPostBodyHeaderListCore() {
        var headerList = [];

        $id(element.postBody).find(":header").each(function (index, header) {
            var $header = $(header);
            var tagName = header.tagName.toLowerCase();
            if (tagName === 'h1' ||
                tagName === 'h2' ||
                tagName === 'h3') {
                if (!header.id) {
                    header.id = "auto_id_" + index;
                }

                headerList.push({
                    id: header.id,
                    text: $header.text(),
                    tagName: tagName,
                    offsetTop: parseInt($header.offset().top, 10)
                });
            }
        });

        return headerList;
    }

    function buildTableOfContentsHtmlCore() {
        var headerList = getPostBodyHeaderListCore();
        var tableOfContentsHtml = [];

        if (headerList.length) {
            tableOfContentsHtml.push('<div id="' + element.toc + '" class="sf_toc_warp">');
            tableOfContentsHtml.push('<div class="title"># ' + getPostTitleCore() + '</div>');
            tableOfContentsHtml.push('<div class="toc">');
            for (var i = 0; i < headerList.length; i++) {
                var header = headerList[i];
                var tableOfContentsItemHtml = "<a" +
                    " href='#" + header.id + "'" +
                    " id='toc_" + header.id + "'" +
                    " class='item item-" + header.tagName + "'" +
                    " title='" + header.text + "'" +
                    ">" +
                    header.text +
                    "</a>";

                tableOfContentsHtml.push(tableOfContentsItemHtml);
            }
            tableOfContentsHtml.push('</div>');
            tableOfContentsHtml.push('</div>');
        }

        return tableOfContentsHtml.join('');
    }

    var count = 0;

    function toggleTableOfContentsCore() {
        var $main= $id(element.main);
        var $forFlow= $class(element.forFlow);
        var $toc = $id(element.toc);

        if ($toc.length === 0) {
            var tocHtml = buildTableOfContentsHtmlCore();
            if (tocHtml) {
                $main.append(tocHtml);
                $toc = $id(element.toc);
            }
            if ($toc) {
                show($toc, $forFlow);
            }
            return;
        }

        if ($toc.css("display") === "none") {
            show($toc, $forFlow);
        } else {
            hide($toc, $forFlow);
        }

        function show($toc, $forFlow) {
            var width = $toc.width();
            if(count == 0){
              var parHeight = $class("sf_toc_warp").height();
              var tocHeight = parHeight - 250;
              $toc.css("height", tocHeight + "px");
              count +=1;
            }
            
            $toc.css("display", "inline-block");
            if (width != null){ 
             
                  $forFlow.css("margin-right", "13%");
                       
            }
        }

        function hide($toc, $forFlow) {
            $toc.css("display", "none");
            $forFlow.css("margin-right", "36px");
        }
    }

    function selectedTableOfContentsItemCore(headerId) {
        var $items = $id(element.toc).find(".item");
        var $current = $("#toc_" + headerId);
        if (!$current.hasClass("current")) {
            $items.removeClass("current");
            $current.addClass("current");
        }
    }

    function watchWindowScrollCore() {
        var headerList = getPostBodyHeaderListCore();
        var scrollTop = $(window).scrollTop() + 80;
        for (var i = 0; i < headerList.length; i++) {
            var current = headerList[i];
            var next = headerList[i + 1];
            if (scrollTop > current.offsetTop) {
                if (next && (scrollTop >= next.offsetTop)) {
                    continue;
                }
                selectedTableOfContentsItemCore(current.id);
                break;
            }
        }
    }

    window.sf = {
       turtleBar: {
            show: showTurtle
        },
        fixedBar: {
            show: showFixedBarCore
        },
        digg: {
            move: moveDiggCore
        },
        post: {
            copyCategoryAndTag: copyCategoryAndTagCore,
        },
        toc: {
            buildId: getPostBodyHeaderListCore,
            toggle: toggleTableOfContentsCore,
            watchWindowScroll: function () {
                $(window).scroll(watchWindowScrollCore);
            }
        },
        run: function () {
            var functionList = Array.prototype.slice.apply(arguments);

            var intervalCoreHandler = setInterval(intervalCore, 500);

            function intervalCore() {
                var length = functionList.length;
                for (var i = 0; i < length; i++) {
                    var functionHandler = functionList[i];
                    if (functionHandler) {
                        var result = functionHandler();
                        if (result) {
                            functionList.splice(i, 1);
                            i--;
                            length--;
                        }
                    }
                }
                if (functionList.length === 0) {
                    clearInterval(intervalCoreHandler);
                }
            };
        }
    };

    window.sf.isMobile = function () {
        return navigator.userAgent.match(/.*Mobile.*/);
    };

    window.sf.addMobileCss = function () {
        $id("home").before('<link href="//files.cnblogs.com/files/linianhui/sf.cnblogs.mobile.css" rel="stylesheet">');
    };

})(window, document, navigator);

if (sf.isMobile()) {
    sf.addMobileCss();
    sf.toc.buildId();
    sf.run(sf.post.copyCategoryAndTag);
} else {
    sf.fixedBar.show();
    sf.toc.toggle();
    sf.toc.watchWindowScroll();
    sf.run(sf.post.copyCategoryAndTag);
}
</script>