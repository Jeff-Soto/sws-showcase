"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import GradientButton from "@/components/common/GradientButton";

export default function DemoCard({ demo }) {
  return (
    <Box
      component="article"
      sx={{
        borderRadius: 3,
        p: 3,
        border: "1px solid rgba(201,160,63,0.15)",
        background:
          "linear-gradient(180deg, rgba(201,160,63,0.08) 0%, rgba(20,20,20,0.95) 100%)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        height: "100%",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 45px rgba(201,160,63,0.25)",
          borderColor: "rgba(201,160,63,0.3)",
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {demo.title}
          </Typography>
          <ArrowOutwardIcon fontSize="small" sx={{ color: "primary.light" }} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {demo.description}
        </Typography>
      </Stack>

      {/* Business Value Section */}
      {demo.businessProblem && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "rgba(201,160,63,0.08)",
            border: "1px solid rgba(201,160,63,0.2)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "primary.light",
              fontWeight: 500,
              mb: 1,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Business Value
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.875rem" }}>
            {demo.businessProblem}
          </Typography>
          {demo.keyBenefits && demo.keyBenefits.length > 0 && (
            <Stack spacing={0.5}>
              {demo.keyBenefits.slice(0, 2).map((benefit, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
                      mt: "0.4em",
                      flexShrink: 0,
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "text.secondary", 
                      fontSize: "0.8125rem",
                      lineHeight: 1.5,
                      flex: 1,
                      pt: 0,
                      mt: 0,
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Target Audience */}
      {demo.targetAudience && demo.targetAudience.length > 0 && (
        <Stack spacing={1}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            Perfect for
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
            }}
          >
            {demo.targetAudience.slice(0, 4).map((audience) => (
              <Chip
                key={audience}
                label={audience}
                size="small"
                sx={{
                  backgroundColor: "rgba(201,160,63,0.08)",
                  border: "1px solid rgba(201,160,63,0.2)",
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            ))}
          </Box>
        </Stack>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {demo.tech.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            size="small"
            sx={{
              backgroundColor: "rgba(201,160,63,0.12)",
              border: "1px solid rgba(201,160,63,0.25)",
            }}
          />
        ))}
      </Stack>

      <Stack spacing={1}>
        {demo.highlights.map((item) => (
          <Box
            key={item}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
                mt: "0.4em",
                flexShrink: 0,
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.5,
                flex: 1,
                pt: 0,
                mt: 0,
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Stack>

      <GradientButton 
        onClick={() => {
          window.location.href = `/demos/${demo.slug}`;
        }}
        href={`/demos/${demo.slug}`} 
        sx={{ mt: "auto", alignSelf: "flex-start" }}
      >
        View Demo
      </GradientButton>
    </Box>
  );
}

