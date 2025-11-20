"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

export default function BusinessValuePanel({ demo }) {
  if (!demo || (!demo.businessProblem && (!demo.keyBenefits || demo.keyBenefits.length === 0))) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: "rgba(201,160,63,0.08)",
        border: "1px solid rgba(201,160,63,0.2)",
        background:
          "linear-gradient(135deg, rgba(201,160,63,0.12) 0%, rgba(20,20,20,0.95) 100%)",
      }}
    >
      <Stack spacing={3}>
        {/* Business Problem */}
        {demo.businessProblem && (
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "primary.light",
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              The Problem
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {demo.businessProblem}
            </Typography>
          </Box>
        )}

        {/* Key Benefits */}
        {demo.keyBenefits && demo.keyBenefits.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "primary.light",
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Business Impact
            </Typography>
            <Stack spacing={1}>
              {demo.keyBenefits.map((benefit, idx) => (
                <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
                      mt: 0.35,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.5,
                    }}
                  >
                    {benefit}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Target Audience */}
        {demo.targetAudience && demo.targetAudience.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "primary.light",
                fontWeight: 600,
                mb: 1.5,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Perfect For
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {demo.targetAudience.map((audience) => (
                <Chip
                  key={audience}
                  label={audience}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(201,160,63,0.12)",
                    border: "1px solid rgba(201,160,63,0.3)",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Use Cases - Collapsible */}
        {demo.useCases && demo.useCases.length > 0 && (
          <Box>
            <Accordion
              sx={{
                backgroundColor: "rgba(201,160,63,0.05)",
                border: "1px solid rgba(201,160,63,0.15)",
                borderRadius: 2,
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: 0,
                  backgroundColor: "rgba(201,160,63,0.08)",
                },
                "&:hover": {
                  backgroundColor: "rgba(201,160,63,0.08)",
                  borderColor: "rgba(201,160,63,0.25)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: "primary.light", fontSize: "1.25rem" }} />
                }
                sx={{
                  px: 2,
                  py: 1.5,
                  minHeight: "auto",
                  "&.Mui-expanded": {
                    minHeight: "auto",
                    borderBottom: "1px solid rgba(201,160,63,0.15)",
                  },
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    "&.Mui-expanded": {
                      margin: 0,
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.light",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Common Use Cases
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, py: 2 }}>
                <Stack spacing={1}>
                  {demo.useCases.map((useCase, idx) => (
                    <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
                          mt: 0.35,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.5,
                        }}
                      >
                        {useCase}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

