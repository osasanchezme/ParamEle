import { Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel, Tag } from "@chakra-ui/react";
import utils from "../utils";

function PropertiesPanel({ visible, width, data }) {
  let top_keys = [];
  let grouped_nodes = {};
  data.nodes.forEach((node) => {
    if (!grouped_nodes.hasOwnProperty(node.type)) grouped_nodes[node.type] = [];
    grouped_nodes[node.type].push(node);
  });
  Object.entries(grouped_nodes).forEach(([key, val]) => {
    top_keys.push(
      <AccordionItem key={key}>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {utils.getDisplayCopy("nodes", key)}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Accordion variant={"child"} allowMultiple >
            {val.map((node) => (
              <AccordionItem key={node.id}>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" style={{ textTransform: "uppercase" }}>
                    {node.data.custom_label ? node.data.custom_label : node.id}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={1}>
                  {node.data.input
                    ? Object.entries(node.data.input).map(([data_key, data_value]) => {
                        let display_copy = utils.getDisplayCopy("tags", utils.splitArgName(data_key, "target").name);
                        return (
                          <Box width="100%" key={data_key} marginBottom={"2px"}>
                            <Tag variant={"targetBig"} size={"md"}>
                              {display_copy} : {typeof data_value == "object" ? JSON.stringify(data_value) : data_value}
                            </Tag>
                          </Box>
                        );
                      })
                    : []}
                  {Object.entries(node.data).map(([data_key, data_value]) => {
                    let display_copy = utils.getDisplayCopy("tags", utils.splitArgName(data_key, "source").name);
                    return data_key !== "input" && data_key !== "custom_label" ? (
                      <Box width="100%" key={data_key}  marginBottom={"2px"}>
                        <Tag variant={"sourceBig"}>
                          {display_copy} : {typeof data_value == "object" ? JSON.stringify(data_value) : data_value}
                        </Tag>
                      </Box>
                    ) : null;
                  })}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    );
  });
  return (
    <div className="properties-panel" style={{ width: width + "%" }}>
      <Accordion allowMultiple variant={"parent"}>
        {top_keys}
      </Accordion>
    </div>
  );
}

export default PropertiesPanel;
