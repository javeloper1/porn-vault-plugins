module.exports = async ({ args, $axios, $cheerio, $throw, $log, actorName, $createImage }) => {
  if (!actorName) $throw("Uh oh. You shouldn't use the plugin for this type of event");

  const name = actorName
    .replace(/#/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  $log(`Scraping JAV actor '${name}', dry mode: ${args.dry || false}...`);

  const actorSearch = `https://xxx.xcity.jp/idol/?genre=/idol/&q=${name.replace(/ /g,"+")}&sg=idol&num=30`;
  let html = (await $axios.get(actorSearch)).data;
  let $ = $cheerio.load(html);

  //if ($('#avidol > .itemBox').length == 0 || $('#avidol > .itemBox').length > 1) {
  if ($('#avidol > .itemBox').length == 0) {
    $throw(`Found ${$('#avidol > .itemBox').length} Actor(s) named ${actorName}. Exiting...`);
  }

  //console.log($('#avidol > .itemBox').html());
  console.log('href',);
  //console.log($('#avidol > .itemBox > .mid > .tn > a').html());

  const actorURL = `https://xxx.xcity.jp/idol/${$('#avidol > .itemBox > .mid > .tn > a').attr("href")}`
  $log(`Querying: ${actorURL}`);
  html = (await $axios.get(actorURL)).data;
  $ = $cheerio.load(html);

  /*
  name: string;
  aliases: string[] = [];
  addedOn = +new Date();
  bornOn: number | null = null;
  thumbnail: string | null = null;
  altThumbnail: string | null = null;
  hero?: string | null = null;
  avatar?: string | null = null;
  favorite: boolean = false;
  bookmark: number | null = null;
  rating: number = 0;
  customFields: Record<
    string,
    boolean | string | number | string[] | null
  > = {};
  description?: string | null = null;
  nationality?: string | null = null;
  */


  //$throw('Stopping here');  

  //const dateObj = $('#video_date');

  //.profile > dd:nth-child(3) > span:nth-child(1)

  //console.log($(".profile > dd").html());
  //console.log('length',$(".profile > dd").length);

  //const finalDate = new Date(dateObj.children().last().text().split('Release Date:')[1].trim()).valueOf();
  //const finalDate = new Date($('#video_date > .text').text().trim()).valueOf();
  
  const thumbnailSrc = `https:${$('.actressThumb').attr("src")}`;
  //const backCoverSrc = frontCoverSrc.replace("h.jpg", "bh.jpg");
  //$log($('#video_cast').text());

  let bornOn;
  $(".profile > dd").each((index, element) => {
    //console.log('span text', $(element).find("span").text())
    if ($(element).find("span").text() == 'Date of birth') {
      let DOB = $(element).text().split('Date of birth')[1];
      if (DOB) {
        bornOn = new Date(DOB).valueOf();
      }
      console.log('bornOn',bornOn);
      //console.log('FOUND',$(element).text().split('Date of birth')[1]);
      //console.log('FOUND',$(element).text());
      //console.log('FOUND',$(element).html());
    }

  });


  if (args.dry === true) {
    $log({
      movieUrl,
      frontCoverSrc,
      //backCoverSrc,
      studioName,
      description,
    });
  } else {
    const thumbnail = await $createImage(thumbnailSrc, `${actorName} (thumbnail)`);

    return {
      'name': actorName,
      'thumbnail': thumbnail,
      'bornOn': bornOn,
    };
  }

  return {};
};
