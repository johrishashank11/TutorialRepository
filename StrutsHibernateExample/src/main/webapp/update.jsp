<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<title>Update Page</title>
</head>
<body>
<s:form action="update">
<s:textfield name="id" label="Id"></s:textfield>
<s:textfield name="user" label="Username"></s:textfield>
<s:password name="pass" label="Password"></s:password>
<s:submit value="Update"></s:submit>
</s:form>
</body>
</html>