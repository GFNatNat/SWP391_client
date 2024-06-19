// electronic
import blog_1 from "@assets/img/blog/blog-1.jpg";
import blog_2 from "@assets/img/blog/blog-2.jpg";
import blog_3 from "@assets/img/blog/blog-3.jpg";
// fashion
import blog_4 from '@assets/img/blog/2/blog-1.jpg';
import blog_5 from '@assets/img/blog/2/blog-2.jpg';
import blog_6 from '@assets/img/blog/2/blog-3.jpg';
// blog postbox 
import blog_post_1 from '@assets/img/blog/blog-big-3.jpg';
import blog_post_2 from '@assets/img/blog/blog-big-2.jpg';
import blog_post_3 from '@assets/img/blog/blog-big-4.jpg';
import blog_post_4 from '@assets/img/blog/blog-big-5.jpg';
import blog_post_5 from '@assets/img/blog/blog-big-6.jpg';
// blog grid 
import blog_grid_1 from '@assets/img/blog/grid/blog-grid-1.jpg';
import blog_grid_2 from '@assets/img/blog/grid/blog-grid-2.jpg';
import blog_grid_3 from '@assets/img/blog/grid/blog-grid-3.jpg';
import blog_grid_4 from '@assets/img/blog/grid/blog-grid-4.jpg';
import blog_grid_5 from '@assets/img/blog/grid/blog-grid-5.jpg';
import blog_grid_6 from '@assets/img/blog/grid/blog-grid-6.jpg';
import blog_grid_7 from '@assets/img/blog/grid/blog-grid-7.jpg';
import blog_grid_8 from '@assets/img/blog/grid/blog-grid-8.jpg';
// list img 
import list_img_1 from '@assets/img/blog/grid/blog-grid-1.jpg';
import list_img_2 from '@assets/img/blog/grid/blog-grid-2.jpg';
import list_img_3 from '@assets/img/blog/grid/blog-grid-3.jpg';
import list_img_4 from '@assets/img/blog/grid/blog-grid-4.jpg';
import list_img_5 from '@assets/img/blog/grid/blog-grid-5.jpg';
import list_img_6 from '@assets/img/blog/grid/blog-grid-6.jpg';
import list_img_7 from '@assets/img/blog/grid/blog-grid-2.jpg';
import list_img_8 from '@assets/img/blog/grid/blog-grid-3.jpg';

const blogData = [
  {
    id: 1,
    img: blog_1,
    date: "14 January, 2023",
    author:'Mark Smith',
    title: "Understanding Diamond Cut: The Key to Sparkle.",
    tags: ["Tablet", "News"],
    category:'electronics',
    comments:2,
    sm_desc:
      "Discover how the cut of a diamond affects its brilliance and overall appearance. Learn about the different types of cuts, from round brilliant to princess cut, and find out which one is right for you.",
    blog: "electronics",
  },
  {
    id: 2,
    img: blog_2,
    date: "18 February, 2023",
    author:'Naim Ahmed',
    title: "The 4Cs of Diamonds: A Comprehensive Guide",
    tags: ["Monitor", "Technology"],
    category:'electronics',
    comments:4,
    sm_desc:
      "Explore the 4Cs of diamonds—cut, color, clarity, and carat weight. This guide will help you understand how each factor influences a diamond's quality and price, ensuring you make an informed purchase.",
    blog: "electronics",
  },
  {
    id: 3,
    img: blog_3,
    date: "20 January, 2023",
    author:'Salim Rana',
    title: "Diamond Certification: What You Need to Know",
    tags: ["Microphone", "Computer"],
    category:'electronics',
    comments:5,
    sm_desc:
      "Learn about the importance of diamond certification and the major gemological laboratories that provide these services. Find out how to read a diamond certificate and why it matters when buying a diamond.",
    blog: "electronics",
  },
  // fashion blog
  {
    id: 4,
    img: blog_4,
    date: "20 July, 2023",
    author:'John Smith',
    title: "Vintage vs. Modern Diamond Rings: Which Is Right for You?",
    tags: ["Fashion", "Lift Style","News"],
    category:'fashion',
    comments:6,
    sm_desc:
      "Compare the timeless elegance of vintage diamond rings with the sleek, contemporary designs of modern rings. Discover the unique characteristics of each style and find the perfect match for your personal taste.",
    blog: "fashion",
  },
  {
    id: 5,
    img: blog_5,
    date: "18 March, 2023",
    author:'John Smith',
    title: "How to Care for Your Diamond Jewelry",
    tags: ["Fashion", "Lift Style","News"],
    category:'fashion',
    comments:3,
    sm_desc:
      "Keep your diamond jewelry looking its best with these essential care tips. From cleaning and storage to regular maintenance, learn how to preserve the beauty and brilliance of your diamonds.",
    blog: "fashion",
  },
  {
    id: 6,
    img: blog_6,
    date: "15 February, 2023",
    author:'John Smith',
    title: "Ethical Diamonds: What You Need to Know About Conflict-Free Gems",
    tags: ["Fashion", "Lift Style","News"],
    category:'fashion',
    comments:8,
    sm_desc:
      "Understand the importance of ethical sourcing in the diamond industry. Learn how to identify conflict-free diamonds and the steps taken by reputable jewelers to ensure their diamonds are ethically sourced.",
    blog: "fashion",
  },
  //postbox blog
  {
    id:7,
    img:blog_post_1,
    date:'July 21, 2023',
    author:'John Smith',
    comments:2,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'The Evolution of Diamond Engagement Rings',
    desc:'Trace the history and evolution of diamond engagement rings. From ancient times to modern-day trends, discover how styles and traditions have changed over the centuries',
    blog:'blog-postbox'
  },
  {
    id:8,
    img:blog_post_2,
    date:'April 18, 2023',
    author:'Mark Smith',
    comments:5,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Customizing Your Diamond Jewelry: Tips and Ideas',
    desc:'Get inspired to create a unique piece of diamond jewelry with these customization tips. Whether its an engagement ring, pendant, or earrings, learn how to add personal touches to your diamond piece',
    video:true,
    video_id:'457mlqV1gzA',
    blog:'blog-postbox'
  },
  {
    id:9,
    date:'March 15, 2023',
    author:'Shahnewaz Sakil',
    comments:8,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Diamond Alternatives: Moissanite, Lab-Grown Diamonds, and More.',
    desc:'Explore the world of diamond alternatives, including moissanite, lab-grown diamonds, and other gemstones. Understand their differences and why they might be a great choice for your next piece of jewelry',
    blockquote:true,
    blog:'blog-postbox'
  },
  {
    id:10,
    date:'January 20, 2023',
    author:'Salim Rana',
    comments:10,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Famous Diamonds and Their Stories',
    desc:'Delve into the fascinating stories behind some of the worlds most famous diamonds. From the Hope Diamond to the Cullinan Diamond, learn about their history, significance, and current whereabouts',
    audio:true,
    audio_id:'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/316547873&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
    blog:'blog-postbox'
  },
  {
    id:11,
    slider:true,
    slider_images:[blog_post_3,blog_post_4,blog_post_5],
    date:'February 20, 2023',
    author:'Smith Mark',
    comments:12,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Time for Spring Cleaning? Use These Tips From the Professionals',
    desc:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
    blog:'blog-postbox'
  },
  // blog grid data 
  {
    id:12,
    img:blog_grid_1,
    list_img:list_img_1,
    date:'January 8, 2023',
    author:'John Smith',
    comments:5,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Hiring the Right Sales Team at the Right Time',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:13,
    img:blog_grid_2,
    list_img:list_img_2,
    date:'February 12, 2023',
    author:'Salim Rana',
    comments:0,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Fully Embrace the Return of 90s fashion',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:14,
    img:blog_grid_3,
    list_img:list_img_3,
    date:'March 15, 2023',
    author:'John Smith',
    comments:12,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Exploring the English Countryside',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:15,
    img:blog_grid_4,
    list_img:list_img_4,
    date:'April 7, 2023',
    author:'John Smith',
    comments:8,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Here’s the First Valentino’s New Makeup Collection',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:16,
    img:blog_grid_5,
    list_img:list_img_5,
    date:'May 2, 2023',
    author:'John Smith',
    comments:4,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Follow Your own Design process, whatever gets',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:17,
    img:blog_grid_6,
    list_img:list_img_6,
    date:'April 5, 2023',
    author:'John Smith',
    comments:6,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Freelancer Days 2022, What’s new?',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:18,
    img:blog_grid_7,
    list_img:list_img_7,
    date:'May 12, 2023',
    author:'John Smith',
    comments:6,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Hiring the Right Sales Team at the Right Time',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:19,
    img:blog_grid_8,
    list_img:list_img_8,
    date:'March 22, 2023',
    author:'John Smith',
    comments:15,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Quality Foods Requirments For Every Human Body’s',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
];

export default blogData;
