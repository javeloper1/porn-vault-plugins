module.exports = async ({ args, $axios, $cheerio, $throw, $log, sceneName, $createImage }) => {
  if (!sceneName) $throw("Uh oh. You shouldn't use the plugin for this type of event");

  const name = sceneName
    .replace(/#/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  $log(`Scraping movie covers for '${name}', dry mode: ${args.dry || false}...`);

  const movieUrl = `https://www.javlibrary.com/en/vl_searchbyid.php?keyword=${name}`;
  const html = (await $axios.get(movieUrl)).data;
  const $ = $cheerio.load(html);

  const description = $("meta[property='og:title']").attr("content").trim().split(' - JAVLibrary')[0];

  const studioName = $('.maker').text().trim();

  //const dateObj = $('#video_date');

  //const finalDate = new Date(dateObj.children().last().text().split('Release Date:')[1].trim()).valueOf();
  const finalDate = new Date($('#video_date > table > tbody > tr > .text').text().trim()).valueOf();
  
  const frontCoverSrc = `https:${$('#video_jacket_img').attr("src")}`;
  //const backCoverSrc = frontCoverSrc.replace("h.jpg", "bh.jpg");
  //$log($('#video_cast').text());

  const actors = [];
  $("#video_cast > table > tbody > tr > .text > .cast").each((index, element) => {
    const foundActor = $(element).find("span").find("a").text().trim();
    console.log("Found Actor:",foundActor);
    //actors.push({'name':foundActor});
    actors.push(foundActor);
    //actors.push({'name':foundActor, 'customFields':});
  });

  const labels = [];
  $("#video_genres > table > tbody > tr > .text > .genre").each((index, element) => {
    const foundLabel = $(element).text().trim();
    console.log("Found Label:",foundLabel);
    labels.push(foundLabel);
  });

  /*
  <span id="cast40297" class="cast">
    <span class="star">
      <a href="vl_star.php?s=ae6q6" rel="tag">Yoshioka Saka</a>
      </span>
    <span id="star_ae6q6" class="icn_favstar" title="Add this star to my favorite list."></span>
  </span>
  */

  

  if (args.dry === true) {
    $log({
      movieUrl,
      frontCoverSrc,
      //backCoverSrc,
      studioName,
      description,
    });
  } else {
    //const frontCoverImg = await $createImage(frontCoverSrc, `${sceneName} (front cover)`);
    //const thumbnail = frontCoverImg;
    const thumbnail = await $createImage(frontCoverSrc, `${sceneName} (thumbnail)`);

    //const backCoverImg = await $createImage(backCoverSrc, `${sceneName} (back cover)`);

    return {
      'thumbnail': thumbnail,
      'actors': actors,
      'labels': labels,
      'description': description,
      'releaseDate': finalDate,
      //'movie': sceneName,
      /*'movie':  {
        'name': sceneName,
        'description': description,
        'releaseDate': finalDate,
        'frontCover': frontCoverImg,
        //backCover: backCoverImg,
        'studio': studioName,
      },*/
      'studio': studioName,
    };
  }

  return {};
};
