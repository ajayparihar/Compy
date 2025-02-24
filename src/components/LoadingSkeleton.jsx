import { Card, CardContent, Grid, Skeleton, Box, CardActions } from '@mui/material';

function LoadingSkeleton() {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={item}>
          <Card 
            sx={{ 
              position: 'relative', 
              overflow: 'hidden',
              height: '100%',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 2s infinite',
              },
              '@keyframes shimmer': {
                '100%': {
                  transform: 'translateX(100%)',
                },
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton 
                    variant="text" 
                    width="60%" 
                    height={32} 
                    sx={{ 
                      mb: 0.5,
                      background: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.08)',
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="30%" 
                    height={20} 
                    sx={{ 
                      background: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.06)',
                    }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3].map((btn) => (
                    <Skeleton 
                      key={btn}
                      variant="circular" 
                      width={28} 
                      height={28} 
                      sx={{ 
                        background: (theme) => 
                          theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.08)',
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Skeleton 
                  variant="text" 
                  width="95%" 
                  height={20} 
                  sx={{ 
                    mb: 1,
                    background: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.06)',
                  }} 
                />
                <Skeleton 
                  variant="text" 
                  width="85%" 
                  height={20} 
                  sx={{ 
                    background: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.06)',
                  }} 
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton 
                  variant="rounded" 
                  width={90} 
                  height={28} 
                  sx={{ 
                    borderRadius: 1,
                    background: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.08)',
                  }} 
                />
                <Skeleton 
                  variant="rounded" 
                  width={70} 
                  height={28} 
                  sx={{ 
                    borderRadius: 1,
                    background: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.08)',
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default LoadingSkeleton;
