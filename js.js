$(function() {

	/*
	** Launch Epic Music
	*/
	($("#musicSound").get(0)).play();

	/*
	** Part of the left image that is not road, we considere that the image
	** has a symetric configuration.
	*/
	const marginRoad = 49;
	const nbHShifts = 8;
	const nbVShifts = 8;

	const roadWidth = $(".background").width() - (2 * marginRoad);
	const roadHeight = $("#gameArea").height();
	const shiftWidth = parseInt((roadWidth - $("#yellow_car").width()) / nbHShifts) + 1;
	const shiftHeight = parseInt((roadHeight - $("#yellow_car").height()) / nbVShifts) + 1;

	var collisionCounted = false;

	function scrollDown()
	{
		const redCar = $("#red_car");
		const backgrounds = $(".background");

		/*
		** place redCar at (rand, gameArea.height) and translate it to the top
		** when translation is over, we place again redCar at (rand, gameArea.heigt()).
		** To increase / decrease speed, we have to
		** decrease / increase timer
		*/
		$("#carSound").get(0).play();
		redCar.delay(rand(0, 5000)).animate({ top: "-=" + ($("#gameArea").height() + redCar.height()) }, 800, "linear", function() {
			const redCarXCoord = (rand(marginRoad, (backgrounds.width() - marginRoad - redCar.width())));
			const redCarYCoord = $("#gameArea").height();

			redCar.css({
				"top": redCarYCoord + "px",
				"left": redCarXCoord + "px"
			});

			collisionCounted  = false;
		});

		/*
		** Scrolls up the background.
		** The background image is W400 x H380
		** To increase / decrease speed, decrease / increase the timer (1300)
		*/
		backgrounds.animate({ top: "-=380" }, 700, "linear", function() {
			backgrounds.css("top", 0);
			scrollDown();
		});
	};

	$(document).keydown(function(e) {

		const yellowCarXCoord = parseInt($('#yellow_car').css("left"));
		const yellowCarYCoord = parseInt($("#yellow_car").css("top"));
		const animationDuration = 50;

		/*
		** Press right arrow
		*/
		if (e.which === 39)
		{
			if (yellowCarXCoord < ($(".background").width() - marginRoad - $("#yellow_car").width()))
				$("#yellow_car").animate({ "left": (yellowCarXCoord + shiftWidth) }, { queue: true, duration:animationDuration });

		}

		/*
		** Press left arrow
		*/
		if (e.which === 37)
		{
			if (yellowCarXCoord > (marginRoad))
				$("#yellow_car").animate({ "left": (yellowCarXCoord - shiftWidth) }, { queue: true, duration: animationDuration });
		}

		/*
		** press up arrow
		*/
		if (e.which === 38)
		{
			if (yellowCarYCoord > 0)
				$("#yellow_car").animate({ "top": (yellowCarYCoord - shiftHeight) }, { queue: true, duration: animationDuration });
		}

		/*
		** press down arrow
		*/
		if (e.which === 40)
		{
			if (yellowCarYCoord < ($("#gameArea").height() - $("#yellow_car").height()))
				$("#yellow_car").animate({ "top": (yellowCarYCoord + shiftHeight) }, { queue: true, duration: animationDuration });
		}
	});

	function checkCollision()
	{
		const yellowCar = $("#yellow_car");
		const redCar = $("#red_car");

		const yellowCarXCoord = parseInt(yellowCar.css("left"));
		const yellowCarYCoord = parseInt(yellowCar.css("top"));
		const redCarXCoord = parseInt(redCar.css("left"));
		const redCarYCoord = parseInt(redCar.css("top"));

		if ((collisionCounted === false)
			&& (areMixedAreas(yellowCar, redCar)))
		{
			collisionCounted = true;
			$('#crashSound').get(0).play();
			$('#collisions_count').text(parseInt($("#collisions_count").text()) + 1);
		}
	}

	scrollDown();
	setInterval(checkCollision, 20);
});

function rand(pMin, pMax)
{
	return (Math.floor(((Math.random() * (pMax - pMin + 1)) + pMin)));
}

function firstIsInAreaOfSecond(vehicle1, vehicle2)
{
		const v1XCoord = parseInt(vehicle1.css("left"));
		const v1YCoord = parseInt(vehicle1.css("top"));
		const v2XCoord = parseInt(vehicle2.css("left"));
		const v2YCoord = parseInt(vehicle2.css("top"));

		return ((v1XCoord > v2XCoord)
			&& (v1XCoord < (v2XCoord + vehicle2.width()))
			&& (v1YCoord > v2YCoord)
			&& (v1YCoord < (v2YCoord + vehicle2.height())));
}

function areMixedAreas(vehicle1, vehicle2)
{
	return ((firstIsInAreaOfSecond(vehicle1, vehicle2)
			|| (firstIsInAreaOfSecond(vehicle2, vehicle1))));
}
