import CourseDetails from "../models/courseDetailsModel.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import ShoppingCart from "../models/shoppingCartModel.js";
import catchAsync from "../utilities/catchAsync.js";


export const shoppingCartPage = catchAsync(async (req, res, next) => {
  res.locals.handlebars = "payment/payment";

  let shoppingCart = null;
  let course = []

  if (res.locals && res.locals.authUser) {
    shoppingCart = Object.values(await ShoppingCart.find({ user_id: res.locals.authUser._id }));
  }

  if (shoppingCart && shoppingCart.length > 0) {
    for (const sc of shoppingCart) {
      const courses = await Course.findOne({ _id: sc.course_id });
      const courseDetails = await CourseDetails.findOne({ course_id: sc.course_id });


      course.push({
        id: sc._id,
        name: courses.name,
        img: courses.img,
        rate: courseDetails.avg_rating,
        numReview: courseDetails.num_reviews,
        view: courseDetails.viewer,
        author: courses.author,
        date: courses.date.slice(0, courses.date.indexOf("T")),
        price: courses.price
      });
    }
  }


  res.render("payment/payment", { course: JSON.stringify(course) });
});

export const updateShoppingCart = catchAsync(async (req, res, next) => {
  if (req.body.deleteItem == "delete") {
    await ShoppingCart.deleteOne({ _id: req.body.id });
    res.locals.cart_number = res.locals.cart_number - 1;
  }
  else if (req.body.deleteItem == "checkout") {
    if (res.locals && res.locals.authUser) {
      const shoppingCart = Object.values(await ShoppingCart.find({ user_id: res.locals.authUser._id }));
      if (shoppingCart && shoppingCart.length > 0) {
        for (const sc of shoppingCart) {
          const user = await User.findOne({ _id: res.locals.authUser._id });
          await User.updateOne(
            { _id: sc.user_id },
            { myCourses: [...user.myCourses, sc.course_id] })
          await ShoppingCart.deleteOne({ _id: sc._id });
        }
      }
    }
  }
  else {
    const { course_id } = req.body;
    const backURL = req.headers.referer;

    if (!res.locals.auth)
      return res.redirect(`${backURL}?message=Please login to continue}`);

    const shopping_cart = { course_id: course_id, user_id: res.locals.authUser._id };
    const prev_course = await ShoppingCart.findOne(shopping_cart);

    if (prev_course) {
      return res.redirect(`${backURL}?message=Course already in cart`);
    }

    await ShoppingCart.create(shopping_cart);

    return res.redirect(`${backURL}?message=Course added to cart`);
  }

  if (req.body.deleteItem == "delete" || req.body.deleteItem == "checkout")
    shoppingCartPage(req, res, next)
})
