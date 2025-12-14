FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["SupportTicketingSystem.Api/SupportTicketingSystem.Api.csproj", "SupportTicketingSystem.Api/"]
COPY ["SupportTicketingSystem.Data/SupportTicketingSystem.Data.csproj", "SupportTicketingSystem.Data/"]
COPY ["SupportTicketingSystem.Domain/SupportTicketingSystem.Domain.csproj", "SupportTicketingSystem.Domain/"]
COPY ["SupportTicketingSystem.Services/SupportTicketingSystem.Services.csproj", "SupportTicketingSystem.Services/"]

RUN dotnet restore "SupportTicketingSystem.Api/SupportTicketingSystem.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/SupportTicketingSystem.Api"
RUN dotnet build "SupportTicketingSystem.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SupportTicketingSystem.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SupportTicketingSystem.Api.dll"]

