import { v4 as uuidv4 } from "uuid";

const MockData = {
  1: [
    {
      id: uuidv4(),
      name: "The Corner Room",
      description:
        "Historic downtown restaurant serving American classics since 1926.",
      start: "9:00 AM",
      end: "10:30 AM",
      image:
        "https://www.statecollege.com/wp-content/uploads/2021/07/IMG_9458-768x498.jpeg",
    },
    {
      id: uuidv4(),
      name: "The Arboretum at Penn State",
      description: "Scenic gardens and greenhouses open to the public.",
      start: "11:00 AM",
      end: "12:30 PM",
      image: "/Arboretum.jpg",
    },
    {
      id: uuidv4(),
      name: "Downtown State College",
      description: "Browse shops and grab lunch in this college-town hub.",
      start: "1:00 PM",
      end: "2:30 PM",
      image:
        "https://www.statecollege.com/wp-content/uploads/2021/01/1478483_40407.jpg",
    },
  ],
  2: [
    {
      id: uuidv4(),
      name: "Berkey Creamery",
      description:
        "Penn State’s famous ice cream spot. Try the Peachy Paterno!",
      start: "10:00 AM",
      end: "11:00 AM",
      image: "/creamer.jpeg",
    },
    {
      id: uuidv4(),
      name: "Old Main",
      description:
        "Historic campus building with panoramic views and bell tower.",
      start: "11:30 AM",
      end: "12:15 PM",
      image: "/old-main.jpg",
    },
    {
      id: uuidv4(),
      name: "Allen Street Gates",
      description: "Iconic entrance to the Penn State campus.",
      start: "12:30 PM",
      end: "1:00 PM",
      image:
        "https://psu-gatsby-files-prod.s3.amazonaws.com/s3fs-public/styles/4_3_2000w/public/4947991516.jpg?itok=be-ahrI2",
    },
  ],
  3: [
    {
      id: uuidv4(),
      name: "Mount Nittany Hike",
      description: "Climb to the top for an amazing view of Happy Valley.",
      start: "8:00 AM",
      end: "10:30 AM",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/8b/Mount_Nittany2.JPG",
    },
    {
      id: uuidv4(),
      name: "Cafe Lemont",
      description:
        "Charming local cafe perfect for coffee and pastries after a hike.",
      start: "11:00 AM",
      end: "12:00 PM",
      image:
        "https://legacy.wpsu.org/assets/images/blogs/cafe-lemont-photo1.jpg",
    },
  ],
  4: [
    {
      id: uuidv4(),
      name: "Palmer Museum of Art",
      description: "Free art museum on campus with rotating exhibitions.",
      start: "10:00 AM",
      end: "11:30 AM",
      image:
        "https://psu-gatsby-files-prod.s3.amazonaws.com/s3fs-public/2024/06/2024.05.31_palmermuseum_saw1177.jpg",
    },
    {
      id: uuidv4(),
      name: "Penn State Bookstore",
      description: "Pick up official PSU gear and gifts.",
      start: "12:00 PM",
      end: "12:45 PM",
      image:
        "https://bloximages.newyork1.vip.townnews.com/psucollegian.com/content/tncms/assets/v3/editorial/7/34/734d5e08-715e-11e4-ad3e-07f27264ed41/546f020fe9d00.image.jpg",
    },
    {
      id: uuidv4(),
      name: "The Waffle Shop",
      description: "Student favorite for breakfast and brunch since the 1970s.",
      start: "1:00 PM",
      end: "2:00 PM",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/10/35/c9/waffle-shop-the.jpg?w=800&h=500&s=1",
    },
  ],
  5: [
    {
      id: uuidv4(),
      name: "Penn State All-Sports Museum",
      description: "Explore Penn State’s legendary sports history.",
      start: "9:30 AM",
      end: "10:30 AM",
      image:
        "https://psu-gatsby-files-prod.s3.amazonaws.com/s3fs-public/4947220927.jpg",
    },
    {
      id: uuidv4(),
      name: "Beaver Stadium",
      description: "One of the largest football stadiums in the U.S.",
      start: "10:45 AM",
      end: "11:30 AM",
      image:
        "https://gopsusports.com/imgproxy/xuPVPshSzLbxQ2PZazgWiKESdVoGiQg7eD4KJZhMK60/rs:fit:1980:0:0/g:ce/q:90/aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2dvcHN1c3BvcnRzLXByb2QvMjAyNC8wNS8xMy9Oa3NGRENvOURDQWdTRlgyTVFqTlRROTN5ejBKb1J3TWZPcWhXWjluLmpwZw.jpg",
    },
    {
      id: uuidv4(),
      name: "Happy Valley Brewing Company",
      description: "Craft beer and gourmet food in a historic barn.",
      start: "6:00 PM",
      end: "8:00 PM",
      image:
        "https://www.visitpa.com/sites/default/files/styles/destination/public/2020-04/Happy%20Valley%20Brewing%202.PNG?itok=-N5IJ3AO",
    },
  ],
  6: [
    {
      id: uuidv4(),
      name: "Millbrook Marsh Nature Center",
      description:
        "Wooden boardwalks through wetland habitats — very peaceful.",
      start: "9:00 AM",
      end: "10:30 AM",
      image:
        "https://i0.wp.com/images.onwardstate.com/uploads/2020/09/millbrook-marsh-ryan-parsons-7-scaled.jpg?fit=2560%2C1707&ssl=1",
    },
    {
      id: uuidv4(),
      name: "Webster’s Bookstore Cafe",
      description: "Cozy bookstore and cafe with local vibes and used books.",
      start: "11:00 AM",
      end: "12:00 PM",
      image:
        "https://images.squarespace-cdn.com/content/v1/5a394d1132601e5cc925c919/1514404391241-KVVZQWO74HWU5GRPUQ2B/bookstore.png?format=2500w",
    },
    {
      id: uuidv4(),
      name: "Fiddlehead Restaurant",
      description: "Healthy, local meals in a chill downtown atmosphere.",
      start: "1:00 PM",
      end: "2:00 PM",
      image:
        "https://img1.wsimg.com/isteam/ip/f973f73d-2f23-4a77-bf5e-3aafeaa71301/blob-30dee39.png",
    },
  ],
  7: [
    {
      id: uuidv4(),
      name: "Discovery Space of Central PA",
      description:
        "Interactive science center, great for families or science lovers.",
      start: "10:00 AM",
      end: "11:30 AM",
      image:
        "https://uncoveringpa.com/wp-content/uploads/2022/02/Discovery-Space-State-College-9943-600x400.jpg",
    },
    {
      id: uuidv4(),
      name: "Tussey Mountain",
      description:
        "Mini golf, go-karts, and winter sports depending on the season.",
      start: "12:00 PM",
      end: "2:00 PM",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/53/a2/ec/tussey-mountain.jpg?w=1200&h=-1&s=1",
    },
  ],
};

export default MockData;
