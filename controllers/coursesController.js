import categoryModel from "../models/categoryModel.js";
import courseModel from "../models/courseModel.js";
import courseDetailsModel from "../models/courseDetailsModel.js";
import { fixDateFormat, fixNumberFormat } from "../utilities/fixFormat.js";
import catchAsync from "../utilities/catchAsync.js";

const loadCourses = async (find_by = {}, sort_by, offset = 1, limit = 10) => {

    const skip = (offset - 1) * limit;

    if (sort_by === 'default') sort_by = '-viewer';
    if (sort_by === 'rating') sort_by = '-avg_rating';

    const allcourses = await courseModel.find(find_by, {'_id': 1});
    const allcourses_id = allcourses.map(course => course._id);

    const courses = (sort_by === 'price') 
    
    ? await courseModel.find(find_by).select('-lectures.sections')
    .sort(sort_by).collation({ locale: 'en', numericOrdering: true })
    .skip(skip).limit(limit).lean()

    : await courseDetailsModel.find({ course_id: { $in: allcourses_id } }).select('-reviews')
    .sort(sort_by).collation({ locale: 'en', numericOrdering: true })
    .skip(skip).limit(limit).lean()

    const newcourse = [];
    
    for (let index = 0; index < courses.length; index++) {
        const course = (sort_by === 'price') ? courses[index] : await courseModel.findOne({ _id: courses[index].course_id }).select('-lectures.sections').lean();
        const coursesDetails = (sort_by === 'price') ? await courseDetailsModel.findOne({ course_id: courses[index]._id }).select('-reviews').lean() : courses[index];

        const newest_course = {
            active: index === 0 ? true : false,
            course_name: course.name,
            course_rate: coursesDetails.avg_rating,
            course_vote: fixNumberFormat(coursesDetails.num_reviews),
            course_viewer: fixNumberFormat(coursesDetails.viewer),
            course_author: course.author,
            course_price: course.price,
            course_category: course.category,
            course_date: fixDateFormat(course.date),
            course_img: course.img,
            course_description: course.description,
            course_duration: course.lectures.duration,
            course_lessons: course.lectures.total
        }
        newcourse.push(newest_course);
    }

    return { courses: newcourse, total_pages: Math.ceil(allcourses.length / limit) };
};

const getPageList = (totalPage) => {
    const pageList = [1];
    if (totalPage > 10) {
        for (let i = 2; i <= Math.min(totalPage, 4); i++)
            pageList.push(i);
        
        pageList.push("...");

        for (let i = Math.min(totalPage - 4, 4); i >= 1; i--)
            pageList.push(totalPage - i + 1);
        }
    else 
        for (let i = 2; i <= totalPage; i++)
            pageList.push(i);
    return pageList;
};

export const coursesPage = catchAsync(async (req, res) => {
    res.locals.handlebars = 'home/courses';
    res.locals.sort_by = req.query.sort_by || 'default';
    res.locals.page = req.query.page || 1;

    const find_by = req.find_by;

    const limit = 10;
    const offset = res.locals.page;

    const results = await loadCourses(find_by, res.locals.sort_by, offset, limit);

    const courses = results.courses;
    const totalPage = results.total_pages;

    const pageList = getPageList(totalPage);

    
    res.render(res.locals.handlebars, { courses, pageList: pageList });
});

export const loadCategory = catchAsync(async (req, res, next) => { 

    const { category, subcategory } = req.params;
    const find_by = {}

    req.find_by = {};

    if (category || subcategory) {
        if (category)
        find_by.slug = `/${category}`;
        if (subcategory)
            find_by.subcategory = { $elemMatch: { slug: `/${subcategory}` } };

        const categoryList = await categoryModel.findOne(find_by).lean();

        const subCategory = categoryList.subcategories.find(category => { 
            return category.slug === `/${subcategory}`;
        });
        
        const categoryName = categoryList ? categoryList.title : null;
        const subcategoryName = subCategory ? subCategory.content : null;

        if (categoryName)
            req.find_by.category = categoryName;
        if (subcategoryName)
            req.find_by.subcategory = { $in: [subcategoryName] };
    }

    next();
});