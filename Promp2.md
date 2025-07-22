I will provide you with a JSON object of companies who are customers of {Honda Motor Co., Ltd.}.
The JSON object is in this format:
{
	"<COMPANY_NAME>": { "<ATTRIBUTE_NAME>": "<ATTRIBUTE_VALUE>" },
	...
}

Here is the JSON object of companies:
<customers>
{
	"KOMATSU": {
	  "PRODUCTS_USED": [
		"HONDA MOBILE POWER PACK E:"
	  ],
	  "FOCUS_AREA": [
		"CONSTRUCTION EQUIPMENT"
	  ],
	  "INDUSTRY": [
		"CONSTRUCTION"
	  ],
	  "SOURCE": [
		"HONDA_REPORT_2023-EN-ALL.PDF"
	  ]
	},
	"FINISHED EQUIPMENT MANUFACTURERS": {
	  "PRODUCTS_USED": [
		"EGX"
	  ],
	  "FOCUS_AREA": [
		"CONSTRUCTION EQUIPMENT"
	  ],
	  "INDUSTRY": [
		"CONSTRUCTION"
	  ],
	  "SOURCE": [
		"HONDA_REPORT_2023-EN-ALL.PDF"
	  ]
	},
	"CORPORATE CLIENTS": {
	  "PRODUCTS_USED": [
		"CONNECTED GARDENING PRODUCTS"
	  ],
	  "FOCUS_AREA": [
		"GARDENING"
	  ],
	  "INDUSTRY": [
		"LANDSCAPING"
	  ],
	  "SOURCE": [
		"HONDA_REPORT_2023-EN-ALL.PDF"
	  ]
	},
	"N BOX MINICARS": {
	  "PRODUCTS_USED": [
		"HONDA SENSING"
	  ],
	  "FOCUS_AREA": [
		"AUTOMOTIVE"
	  ],
	  "INDUSTRY": [
		"AUTOMOTIVE"
	  ],
	  "SOURCE": [
		"HONDA_REPORT_2023-EN-ALL.PDF"
	  ]
	}
  }
</customers>

Perform the following steps:
1. Categorise each item in <customers> into companies/conglomerates/organisations vs others.
2. Keep only companies/conglomerates/organisations and remove every other categories.
3. Exclude groups of companies or categories of companies.
4. Some of the attributes may be missing due to lack of information in the source document but this does not necessarily mean that an item is not a company/conglomerate/organisation.
5. If there are some indication that an item is a company/conglomerate/organisation even though there are limited information, you may include it as an company/conglomerate/organisation.
6. Assess each item individually and print your explanation within <explanation> tags.
7. After printing the explanation, print an array containing only names of companies/conglomerates/organisations between <customers></customers> tags.  E.g. [ "COMPANY" ]
