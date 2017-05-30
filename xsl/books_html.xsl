<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="html" index="yes"/>
<xsl:template match="/">
<html>
    <head>
        <title>Books Output</title>
        <style>
            body {font-family: Calibri, Arial, sans-serif;}
            .end {font-style:italic; color:gray;}
        </style>
    </head>
    <body>
    <xsl:apply-templates/>
    </body>
</html>
</xsl:template>
<xsl:template match="catalog/book">
<xsl:variable name="bookid" select="./@id"/>
<div id="{$bookid}" class="bookGroup">
    <h1>
        <xsl:value-of select="./title"/>
    </h1>
    <h2>
        By <xsl:value-of select="./author"/>
    </h2>
    <p>
        <xsl:value-of select="./description"/>
    </p>
    <p class="end">
        <xsl:value-of select="./genre"/> | $<xsl:value-of select="./price"/> | <xsl:value-of select="./publish_date"/>
    </p>
    </div>
</xsl:template>
</xsl:stylesheet>