<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<title>Logging Tutorial Example</title>
</head>
<body>
<s:form action="register">
<s:textfield name="username" label="Username"></s:textfield>
<s:password name="password" label="Password"></s:password>
<s:submit value="Login"></s:submit>
</s:form>
</body>
</html>