<%@include file="dbconnect.jsp" %>

<c:set var="name" value="${param.name}"/>
<c:set var="msg" value="${param.msg}"/>

<sql:update dataSource="${snapshot}" var="count">
  INSERT INTO chat(USERNAME, CHATDATE, MSG) values (?, now(), ?)
  <sql:param value="${name}" />  
  <sql:param value="${msg}" />
</sql:update>