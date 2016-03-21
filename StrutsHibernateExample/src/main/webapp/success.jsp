<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<title>Welcome</title>
</head>
<body>
<h2>Record Has Been Inserted Successfully</h2>
<table border="5">
<tr>
<td>ID</td>
<td>Username</td>
<td>Password</td>
</tr>
<s:iterator value="loginlist">
<tr>
<td><s:property value="id"/></td>
<td><s:property value="username"/></td>
<td><s:property value="password"/></td>
</tr>
</s:iterator>
</table>
</body>
</html>