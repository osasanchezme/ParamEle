import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
  Tag,
  Tooltip,
  IconButton,
  Text,
  HStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { MdCopyAll, MdUnfoldLess } from "react-icons/md";
import utils from "../utils";
import state from "../state";
import { useState } from "react";

function PropertiesPanel({ visible, width, data }) {
  const [expanded_index, setExpandedIndex] = useState([]);
  let top_keys = [];
  let grouped_nodes = {};
  data.nodes.forEach((node) => {
    if (!grouped_nodes.hasOwnProperty(node.type)) grouped_nodes[node.type] = [];
    grouped_nodes[node.type].push(node);
  });
  function handleClickOnTag(e) {
    let coords_str = e.target.title;
    let coords = coords_str.split("|");
    state.zoomToCoordinate(Number(coords[0]), Number(coords[1]));
  }
  function handleClickOnCopy(e) {
    state.copyStructureToClipboard();
  }
  function handleClickOnCollapse(e) {
    setExpandedIndex([]);
  }
  function handleClickOnAccordionButton(e, i) {
    let index_of_clicked = expanded_index.indexOf(i);
    if (index_of_clicked < 0) {
      setExpandedIndex([...expanded_index, i]);
    } else {
      setExpandedIndex([...expanded_index.slice(0, index_of_clicked), ...expanded_index.slice(index_of_clicked + 1, expanded_index.length)]);
    }
  }
  Object.entries(grouped_nodes).forEach(([key, val], i) => {
    top_keys.push(
      <AccordionItem key={key}>
        <AccordionButton onClick={(event) => handleClickOnAccordionButton(event, i)}>
          <Box as="span" flex="1" textAlign="left">
            {utils.getDisplayCopy("nodes", key)}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Accordion variant={"child"} allowMultiple>
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
                            <Tag variant={"targetBig"} title={`${node.position.x}|${node.position.y}`} onClick={handleClickOnTag}>
                              {display_copy} : {typeof data_value == "object" ? JSON.stringify(data_value) : data_value}
                            </Tag>
                          </Box>
                        );
                      })
                    : []}
                  {Object.entries(node.data).map(([data_key, data_value]) => {
                    let display_copy = utils.getDisplayCopy("tags", utils.splitArgName(data_key, "source").name);
                    return data_key !== "input" && data_key !== "custom_label" ? (
                      <Box width="100%" key={data_key} marginBottom={"2px"}>
                        <Tag variant={"sourceBig"} title={`${node.position.x}|${node.position.y}`} onClick={handleClickOnTag}>
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
      <div className="panel-top-bar">
        <Grid templateColumns="repeat(15, 1fr)" gap={2}>
          <GridItem colSpan={9}>{utils.getDisplayCopy("properties_panel", "title")}</GridItem>
          <GridItem colStart={14} colEnd={14}>
            <Tooltip
              className="clear-tooltip"
              label={
                <HStack>
                  <Text>{utils.getDisplayCopy("properties_panel", "collapse_all")}</Text>
                </HStack>
              }
            >
              <IconButton
                className="small-ghost-button"
                onClick={handleClickOnCollapse}
                variant="ghost"
                aria-label="Collapse"
                icon={<MdUnfoldLess />}
              />
            </Tooltip>
          </GridItem>
          <GridItem colStart={15} colEnd={15}>
            <Tooltip
              className="clear-tooltip"
              label={
                <HStack>
                  <Text>{utils.getDisplayCopy("properties_panel", "copy_json")}</Text>
                </HStack>
              }
            >
              <IconButton
                className="small-ghost-button"
                onClick={handleClickOnCopy}
                variant="ghost"
                aria-label="Copy structure"
                icon={<MdCopyAll />}
              />
            </Tooltip>
          </GridItem>
        </Grid>
      </div>
      <Accordion allowMultiple variant={"parent"} index={expanded_index}>
        {top_keys}
      </Accordion>
    </div>
  );
}

export default PropertiesPanel;
