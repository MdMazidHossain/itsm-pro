using System.Management;
using System.Net.Http.Json;

namespace ItsmAgent;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly HttpClient _httpClient;
    private readonly string _agentId = Guid.NewGuid().ToString();
    private readonly string _tenantId = "84efb00e-0437-4694-aa7c-60dbd7fa19e8"; // আপনার টেন্যান্ট আইডি
    private readonly string _apiUrl = "http://localhost:3000/devices/register";

    public Worker(ILogger<Worker> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _httpClient.DefaultRequestHeaders.Add("x-tenant-id", _tenantId);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ITSM Agent starting with ID: {AgentId}", _agentId);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var deviceInfo = CollectDeviceInfo();
                _logger.LogInformation("Collected: {Hostname} | CPU: {Cpu}% | RAM: {Ram}% | Disk: {Disk}%", 
                    deviceInfo.Hostname, deviceInfo.CpuUsage, deviceInfo.RamUsage, deviceInfo.DiskUsage);

                var response = await _httpClient.PostAsJsonAsync(_apiUrl, deviceInfo, stoppingToken);
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Device data sent to API successfully");
                }
                else
                {
                    _logger.LogWarning("API returned: {StatusCode}", response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error collecting or sending device info");
            }

            await Task.Delay(TimeSpan.FromSeconds(60), stoppingToken);
        }
    }

    private DeviceInfo CollectDeviceInfo()
    {
        return new DeviceInfo
        {
            AgentId = _agentId,
            Hostname = Environment.MachineName,
            OsInfo = Environment.OSVersion.ToString(),
            IpAddress = GetLocalIpAddress(),
            CpuUsage = GetCpuUsage(),
            RamUsage = GetRamUsage(),
            DiskUsage = GetDiskUsage()
        };
    }

    private double GetCpuUsage()
    {
        try
        {
            using var searcher = new ManagementObjectSearcher("SELECT LoadPercentage FROM Win32_Processor");
            foreach (var obj in searcher.Get()) return Convert.ToDouble(obj["LoadPercentage"]);
        }
        catch { }
        return 0;
    }

    private double GetRamUsage()
    {
        try
        {
            using var searcher = new ManagementObjectSearcher("SELECT TotalVisibleMemorySize, FreePhysicalMemory FROM Win32_OperatingSystem");
            foreach (var obj in searcher.Get())
            {
                var total = Convert.ToDouble(obj["TotalVisibleMemorySize"]);
                var free = Convert.ToDouble(obj["FreePhysicalMemory"]);
                return Math.Round((total - free) / total * 100, 2);
            }
        }
        catch { }
        return 0;
    }

    private double GetDiskUsage()
    {
        try
        {
            using var searcher = new ManagementObjectSearcher("SELECT Size, FreeSpace FROM Win32_LogicalDisk WHERE DriveType=3");
            double totalSize = 0, totalFree = 0;
            foreach (var obj in searcher.Get())
            {
                totalSize += Convert.ToDouble(obj["Size"]);
                totalFree += Convert.ToDouble(obj["FreeSpace"]);
            }
            return totalSize > 0 ? Math.Round((totalSize - totalFree) / totalSize * 100, 2) : 0;
        }
        catch { }
        return 0;
    }

    private string GetLocalIpAddress()
    {
        try
        {
            var host = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork) return ip.ToString();
            }
        }
        catch { }
        return "Unknown";
    }
}

public class DeviceInfo
{
    public string AgentId { get; set; } = string.Empty;
    public string Hostname { get; set; } = string.Empty;
    public string OsInfo { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public double CpuUsage { get; set; }
    public double RamUsage { get; set; }
    public double DiskUsage { get; set; }
}
