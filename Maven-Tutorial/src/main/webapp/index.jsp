<%@ taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<title>Struts Project</title>
</head>
<body>
<s:form action="login" method="post">
<s:textfield name="user" label="Username"></s:textfield>
<s:submit value="Submit"></s:submit>
</s:form>
</body>
</html>