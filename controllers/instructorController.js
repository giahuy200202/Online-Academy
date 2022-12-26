import { NOTIMP } from "dns";
import express from "express";
import catchAsync from "../utilities/catchAsync.js";
import validateUser from '../middlewares/auth.mdw.js';
import multer from 'multer';
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const getMyCourses = function (req,res,next) {
    //res.render('instructor/my-courses.hbs');
    const list = [
        {
            id: 1,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 1
        },
        {
            id: 2,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 0
        },
        {
            id: 3,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 1
        },
        {
            id: 4,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 0
        },
        {
            id: 5,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 1
        },
        {
            id: 6,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 0
        },
        {
            id: 7,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 1
        },
        {
            id: 8,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 1
        },
        {
            id: 9,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 0
        },
        {
            id: 10,
            title: "The Complete 2023 Web Development Bootcamp",
            category: "Web Development",
            price: {
                currency: "$",
                amount: "99"
            },
            date_released: "2022-12-31",
            finish: 1
        }
    ]
    res.render('instructor/myCourses', {
        layout: "instructor",
        course_list: list,
        empty: list.length === 0
});
}

export const addCourseDescription = (req,res) => {
}

export const addCourseContent = (req,res) => {
    const lectures_empty = {
        sections: [
        ]
    };
    const lectures = {
        sections: [
            {
                title: "Section 1",
                lessons:[
                    {
                        title: "About the course"
                    },
                    {
                        title: "What You'll Get in This Course"
                    },
                    {
                        title: "Download the course syllabus"
                    },
                    {
                        title: "Prepare your workspace"
                    }
                ]
            },
            {
                title: "Section 2",
                lessons:[
                    {
                        title: "About the course"
                    },
                    {
                        title: "What You'll Get in This Course"
                    },
                    {
                        title: "Download the course syllabus"
                    },
                    {
                        title: "Prepare your workspace"
                    }
                ]
            },
            {
                title: "Section 3",
                lessons:[
                ]
            }
        ]
    };
    res.render('instructor/addCourseContent', {
        layout: "instructor",
        sections: lectures.sections,
       // sections_empty: lectures.sections.length == 0
        sections_empty: true

    });
}
const __dirname = dirname(fileURLToPath(import.meta.url));

export const uploadLesson = catchAsync(async(req,res,next) => {
    res.locals.handlebars = "instructor/addCourseContent";
    res.locals.layout = "instructor.hbs";
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `./public/tmp/my-uploads`)
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        }
    })
    const upload = multer({ storage: storage });
    upload.single('videoUploadFile')(req,res, (err) => {
        console.log(req.body);
        if (err) { console.error(err);}
        else res.render('instructor/addCourseContent', {layout: 'instructor'});
    })
});