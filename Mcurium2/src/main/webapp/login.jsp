<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%@ taglib uri="/struts-tags" prefix="s"%>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CMS Login</title>
	<!-- BOOTSTRAP STYLES-->
    <link href="assets/css/bootstrap.css" rel="stylesheet" />
     <!-- FONTAWESOME STYLES-->
    <link href="assets/css/font-awesome.css" rel="stylesheet" />
        <!-- CUSTOM STYLES-->
    <link href="assets/css/custom.css" rel="stylesheet" />
     <!-- GOOGLE FONTS-->
   <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />

</head>
<body>
    <s:div cssClass="container">
        <s:div cssClass="row text-center ">
            <s:div cssClass="col-md-12">
                <br /><br />
                <h2> User Login </h2>
               
                <h5>( Login yourself to get access )</h5>
                 <br />
            </s:div>
        </s:div>
         <s:div cssClass="row ">
               
                  <s:div cssClass="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
                        <s:div cssClass="panel panel-default">
                            <s:div cssClass="panel-heading">
                        <strong>   Enter Details To Login </strong>  
                            </s:div>
                            <s:div cssClass="panel-body">
                                <s:form role="form" action="loginmgmt">
                                       <br />
                                      	<s:div cssClass="form-group input-group">
                                            <span class="input-group-addon"><i class="fa fa-tag"  ></i></span>
                                            <input name="user" type="text" class="form-control" placeholder="Your Username " />
                                        </s:div>
                                        <s:div cssClass="form-group input-group">
                                            <span class="input-group-addon"><i class="fa fa-lock"  ></i></span>
                                            <input name="pass" type="password" class="form-control"  placeholder="Your Password" />
                                        </s:div>
                                        <hr/>
                                     <s:submit value="Login Now" cssClass="btn btn-primary "></s:submit>
                                    </s:form>
                            </s:div>
                           
                        </s:div>
                    </s:div>
                
                
        </s:div>
    </s:div>


     <!-- SCRIPTS -AT THE BOTOM TO REDUCE THE LOAD TIME-->
    <!-- JQUERY SCRIPTS -->
    <script src="assets/js/jquery-1.10.2.js"></script>
      <!-- BOOTSTRAP SCRIPTS -->
    <script src="assets/js/bootstrap.min.js"></script>
    <!-- METISMENU SCRIPTS -->
    <script src="assets/js/jquery.metisMenu.js"></script>
      <!-- CUSTOM SCRIPTS -->
    <script src="assets/js/custom.js"></script>
   
</body>
</html>
