import { v4 as uuidv4 } from "uuid";

const MockData = {
  1: [
    {
      id: 1,
      name: "The Arboretum at Penn State",
      description:
        "Stunning botanical gardens with diverse plant collections, walking paths, and a serene atmosphere. Perfect for a morning stroll and enjoying nature.",
      start: "9:00 AM",
      end: "12:00 PM",
      image: null,
    },
    {
      id: 2,
      name: "Webster's Bookstore Cafe",
      description:
        "Cozy bookstore and cafe with local vibes and used books. Grab a coffee and browse unique titles.",
      start: "12:30 PM",
      end: "2:00 PM",
      image: null,
    },
    {
      id: 3,
      name: "Palmer Museum of Art",
      description:
        "Penn State's art museum featuring a diverse collection spanning various periods and cultures. Free admission.",
      start: "2:30 PM",
      end: "4:30 PM",
      image: null,
    },
    {
      id: 4,
      name: "Otto's Pub and Brewery",
      description:
        "Local brewery with a wide selection of craft beers and delicious pub fare. A great spot for a relaxed evening.",
      start: "6:00 PM",
      end: "8:00 PM",
      image: null,
    },
  ],
  2: [
    {
      id: 1,
      name: "Shaver's Creek Environmental Center",
      description:
        "Nature center with raptor rehabilitation, hiking trails, and educational exhibits. A short drive from State College.",
      start: "9:30 AM",
      end: "1:00 PM",
      image: null,
    },
    {
      id: 2,
      name: "Happy Valley Brewing Company",
      description:
        "Another local brewery with a relaxed atmosphere and a rotating selection of unique brews. Enjoy a flight and some snacks.",
      start: "1:30 PM",
      end: "3:00 PM",
      image: null,
    },
    {
      id: 3,
      name: "The State Theatre",
      description:
        "Historic downtown venue hosting live music, independent films, and various performances. Check their schedule for events.",
      start: "7:00 PM",
      end: "9:00 PM",
      image: null,
    },
  ],
  3: [
    {
      id: 1,
      name: "Millbrook Marsh Nature Center",
      description:
        "Wetland ecosystem with boardwalks and trails, perfect for birdwatching and enjoying tranquil nature close to town.",
      start: "9:00 AM",
      end: "11:30 AM",
      image: null,
    },
    {
      id: 2,
      name: "The Corner Room",
      description:
        "Iconic State College diner, a local institution known for its classic American comfort food and lively atmosphere.",
      start: "12:00 PM",
      end: "1:30 PM",
      image: null,
    },
    {
      id: 3,
      name: "Penn State Creamery",
      description:
        "World-renowned ice cream parlor on campus, famous for its fresh, delicious flavors. A must-try for any visitor.",
      start: "2:00 PM",
      end: "3:00 PM",
      image: null,
    },
    {
      id: 4,
      name: "Tussey Mountain",
      description:
        "Recreational area offering scenic views, disc golf, and in season, a driving range or mini-golf. Check for seasonal activities.",
      start: "4:00 PM",
      end: "6:00 PM",
      image: null,
    },
  ],
  4: [
    {
      id: 1,
      name: "Mount Nittany",
      description:
        "Challenging but rewarding hike to the summit of Mount Nittany, offering panoramic views of the valley. Wear sturdy shoes.",
      start: "9:00 AM",
      end: "1:00 PM",
      image: null,
    },
    {
      id: 2,
      name: "Rothrock State Forest (Jo Hays Vista)",
      description:
        "Scenic overlook offering breathtaking views of the surrounding mountains and valleys. A great spot for photography.",
      start: "2:00 PM",
      end: "3:30 PM",
      image: null,
    },
    {
      id: 3,
      name: "Gigi's Southern Table",
      description:
        "Charming restaurant serving delicious Southern comfort food with a modern twist. Reservations recommended.",
      start: "6:30 PM",
      end: "8:30 PM",
      image: null,
    },
  ],
  5: [
    {
      id: 1,
      name: "Penn's Cave & Wildlife Park",
      description:
        "America's only all-water cavern and wildlife park. Explore by boat and see native Pennsylvania animals.",
      start: "9:30 AM",
      end: "1:00 PM",
      image: null,
    },
    {
      id: 2,
      name: "Elk Creek Cafe & Aleworks",
      description:
        "Brewery and restaurant in nearby Millheim, known for its farm-to-table menu and excellent craft beers. A scenic drive.",
      start: "1:30 PM",
      end: "3:30 PM",
      image: null,
    },
    {
      id: 3,
      name: "Downtown State College Shopping",
      description:
        "Explore the unique boutiques, gift shops, and local businesses in downtown State College. Find a souvenir or unique item.",
      start: "4:00 PM",
      end: "5:30 PM",
      image: null,
    },
  ],
  6: [
    {
      id: 1,
      name: "Bellefonte Waterfront Walk",
      description:
        "Picturesque walk along Spring Creek in historic Bellefonte, featuring charming shops and Victorian architecture.",
      start: "10:00 AM",
      end: "12:00 PM",
      image: null,
    },
    {
      id: 2,
      name: "Talleyrand Park",
      description:
        "Beautiful park in Bellefonte with a gazebo, walking paths, and a duck pond. A peaceful spot to relax.",
      start: "12:00 PM",
      end: "1:00 PM",
      image: null,
    },
    {
      id: 3,
      name: "Big Spring Spirits",
      description:
        "Craft distillery in Bellefonte offering tours and tastings of their locally made spirits. Learn about the distilling process.",
      start: "1:30 PM",
      end: "2:30 PM",
      image: null,
    },
    {
      id: 4,
      name: "Axemann Brewery",
      description:
        "Large brewery in Bellefonte with a spacious taproom and a variety of beers on tap. Often has food trucks.",
      start: "3:00 PM",
      end: "4:30 PM",
      image: null,
    },
  ],
  7: [
    {
      id: 1,
      name: "State College Farmers Market (seasonal)",
      description:
        "Vibrant outdoor market featuring local produce, baked goods, crafts, and more. Check for operating days and times.",
      start: "9:00 AM",
      end: "11:00 AM",
      image: null,
    },
    {
      id: 2,
      name: "The Nittany Lion Shrine",
      description:
        "Iconic Penn State landmark, perfect for a photo opportunity and a quick visit to campus.",
      start: "11:30 AM",
      end: "12:00 PM",
      image: null,
    },
    {
      id: 3,
      name: "Cafe Lemont",
      description:
        "Charming cafe in the historic village of Lemont, known for its delicious coffee and pastries. A relaxed final stop.",
      start: "12:30 PM",
      end: "1:30 PM",
      image: null,
    },
  ],
};


export default MockData;
