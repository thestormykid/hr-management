var express = require('express');
var router  = express.Router();
var passport = require('passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

var routes = {
    views : {
        attendance: require('./views/attendance'),
        designation: require('./views/designation'),
        employee: require('./views/employee'),
        salaryComponent: require('./views/salaryComponent'),
        shift: require('./views/shifts'),
        factor: require('./views/factor'),
        user: require('./views/user')
    }
}


// router.get('/test', routes.views.factor.index);

// user components
router.post('/signup', routes.views.user.signUp);
// router.post('/signin', passportSignIn, routes.views.employee.signIn);
router.get('/secret', passportJWT, routes.views.user.secret);

// salary components
router.get('/getAllComponents', routes.views.salaryComponent.getAllComponents);
router.post('/addComponent', routes.views.salaryComponent.addComponent);
router.put('/updateComponent', routes.views.salaryComponent.updateComponent);
router.delete('/deleteComponent/:id', routes.views.salaryComponent.deleteComponent);

// designation
router.get('/getAllDesignation', routes.views.designation.getAllDesignation);
router.post('/addDesignation', routes.views.designation.addDesignation);
router.put('/updateDesignation', routes.views.designation.updateDesignation);
router.delete('/deleteDesignation/:id', routes.views.designation.deleteDesignation);

// shift
router.get('/getAllShifts', routes.views.shift.getAllShifts);
router.post('/addShift', routes.views.shift.addShift);
router.delete('/removeShift/:id', routes.views.shift.deleteShift);
router.put('/updateShift', routes.views.shift.updateShift);

// factor
router.get('/getAllFactor', routes.views.factor.getAllFactor);
router.post('/addFactor', routes.views.factor.addFactor);
router.put('/updateFactor', routes.views.factor.updateFactor);
router.delete('/removeFactor/:id', routes.views.factor.removeFactor);
router.get('/getSelectedFactors', routes.views.factor.getSelectedFactors);

// employee
router.get('/getAllEmployee', routes.views.employee.getAllEmployee);
router.post('/addEmployee', routes.views.employee.addEmployee);
router.put('/updateEmployee', routes.views.employee.updateEmployee);
router.delete('/removeEmployee/:id', routes.views.employee.removeEmployee);
router.post('/signin', passportSignIn, routes.views.employee.signIn);
router.get('/getEmployeeCount', passportJWT, routes.views.employee.getEmployeeCount);

// router.post('/checkEmail', routes.views.employee.checkEmail);
router.post('/sendEmail', routes.views.employee.sendEmail);
router.post('/checkAdmin/:token', routes.views.employee.checkAdmin);
router.post('/checkFirstTimeUser', passportJWT, routes.views.employee.checkFirstTimeUser);
router.put('/update-password', passportJWT, routes.views.employee.updatePassword);

// attendance
router.post('/markAttendance', passportJWT, routes.views.attendance.markAttendance);
router.get('/getSelectedEmployee', routes.views.attendance.getSelectedEmployee);
router.get('/getUserAttendance', passportJWT, routes.views.attendance.getUserAttendance);
router.delete('/deleteAttendance/:id', routes.views.attendance.deleteAttendance);
router.put('/approveAttendance', routes.views.attendance.approveAttendance);
router.get('/apply-filter', passportJWT, routes.views.attendance.applyFilter);
router.get('/getAttendanceCount', passportJWT, routes.views.attendance.getAttendanceCount);

// router.get('/checkAttendance', routes.views.attendance.checkAttendance);

module.exports = router
