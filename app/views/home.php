<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Golf Vista</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">

		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/bootstrap-responsive.min.css" rel="stylesheet">
		<link href="css/screen.css" rel="stylesheet">

		<!--[if lt IE 9]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>

	<body>

		<div class="container">
			<h1>Golf Vista</h1>
			<p>Enter a location to view nearby golf courses.</p>
			<div class="row">
				<div class="span4">
					<div class="search-container">
						<form id="course-search-form">
							<label for="location">Enter Location</label>
							<div class="input-append control-group input-container">
								<input type="text" name="location" id="location" class="span2" tabindex="1" />
								<button type="button" id="search" class="btn" tabindex="2"><span>Search</span></button>
							</div>
						</form>
					</div>
					<script id="ajax-locations" type="text/x-handlebars-template">
						{{#each locations}}
						<div class="course-location">
							<h4><a href="http://maps.google.com//maps?q={{address}}" target="_blank"><strong>{{name}}</strong></a></h4>
							<p>{{address}}</p>
							<p><a href="http://maps.google.com//maps?f=d&hl=en&saddr=&daddr={{address}}" target="_blank">Get Directions</a></p>
							{{#if photos}}
							<div class="photos clearfix">
								{{#each_upto photos 3}}
								<div class="photo">
									<img id="{{id}}" src="http://farm{{farm}}.staticflickr.com/{{server}}/{{id}}_{{secret}}_s.jpg" alt="{{title}}" />
								</div>
								{{/each_upto}}
							</div>
							{{/if}}
						</div>
						{{/each}}
					</script>
					<div class="course-list-container"></div>
				</div>
				<div id="map_container" class="span8 hidden-phone">
					<div id="map_canvas"></div>
				</div>
			</div>
		</div>
		<footer class="container">
			<div class="row">
				<p class="span12">&#169; <?= date('Y') ?> JoshHutson.com</p>
			</div>
		</footer>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="//maps.googleapis.com/maps/api/js?libraries=places&sensor=true"></script>
		<?php /*
		<script src="//maps.googleapis.com/maps/api/js?key=AIzaSyD1bFbIpMttJhAN3hqC4NxOFI6d9Xss3GQ&sensor=true"></script>
		*/ ?>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/handlebars.min.js"></script>
		<script src="js/global.js"></script>
	</body>
</html>
